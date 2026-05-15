"use client"

import React, { useReducer, useRef, useEffect, useCallback, useMemo } from 'react'
import { MousePointerClick, RotateCcw } from 'lucide-react'

// --- 1. TYPES & CONSTANTS ---
type CardPosition = number | 'swoop-out'

interface CardState {
  id: number
  src: string
  pos: CardPosition
}

interface HistoricalImageStackProps {
  images?: string[]
}

type State = {
  cards: CardState[]
  isAnimating: boolean
};

// Simplified Actions
type Action = 
  | { type: 'START_ANIMATION' }
  | { type: 'REMOVE_CARD' }
  | { type: 'RESET'; payload: string[] }

// --- 2. REDUCER FOR ANIMATION PHASES ---
function stackReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'START_ANIMATION':
      return {
        ...state,
        isAnimating: true,
        cards: state.cards.map(card => {
          // Top card swoops out
          if (card.pos === 0) return { ...card, pos: 'swoop-out' }
          // All other cards move forward
          if (typeof card.pos === 'number' && card.pos > 0) return { ...card, pos: card.pos - 1 }
          return card
        })
      };
    case 'REMOVE_CARD':
      return {
        isAnimating: false,
        // Completely delete the card that just finished swooping out
        cards: state.cards.filter(card => card.pos !== 'swoop-out')
      }
    case 'RESET':
      return {
        isAnimating: false,
        cards: action.payload.map((src, index) => ({
          id: index + 1,
          src,
          pos: index
        }))
      }
    default:
      return state
  }
}

// --- 3. MEMOIZED CHILD COMPONENT ---
const ArchiveCard = React.memo(function ArchiveCard({ 
  card, 
  getStyles 
}: { 
  card: CardState; 
  getStyles: (pos: CardPosition) => { className: string; style: React.CSSProperties }
}) {
  const { className, style } = getStyles(card.pos)
  
  return (
    <img 
      src={card.src} 
      alt={`GGFM Archive ${card.id}`}
      className={className}
      style={style}
      loading="lazy"
    />
  );
});

// --- 4. MAIN COMPONENT ---
export function HistoricalImageStack({
  images = [
    "https://picsum.photos/id/1016/400/400",
    "https://picsum.photos/id/1019/400/400",
    "https://picsum.photos/id/1015/400/400",
    "https://picsum.photos/id/1018/400/400",
    "https://picsum.photos/id/1017/400/400",
    "https://picsum.photos/id/1014/400/400",
    "https://picsum.photos/id/1013/400/400",
    "https://picsum.photos/id/1012/400/400"
  ]
}: HistoricalImageStackProps) {
  
  const [state, dispatch] = useReducer(stackReducer, images, (initialImages): State => ({
    isAnimating: false,
    cards: initialImages.map((src, index) => ({
      id: index + 1,
      src,
      pos: index
    }))
  }))

  const timeouts = useRef<NodeJS.Timeout[]>([])

  useEffect(() => {
    return () => {
      timeouts.current.forEach(clearTimeout)
    }
  }, [])

  const getCardStyles = useCallback((pos: CardPosition) => {
    const baseClasses = "absolute top-0 left-0 w-full h-full object-cover rounded-xl border border-[#222] bg-[#111] shadow-xl transition duration-300 ease-out origin-center cursor-pointer"
    
    // Smoothly slides to the right and fades to 0
    if (pos === 'swoop-out') {
      return {
        className: baseClasses,
        style: { transform: 'translate(105%, 10%) rotate(15deg) scale(1)', zIndex: 40, opacity: 0 }
      }
    }

    const numPos = pos as number
    const isFront = numPos === 0
    const vPos = Math.min(numPos, 3)
    
    return {
      className: `${baseClasses} ${isFront ? 'hover:border-[#569429]' : ''}`,
      style: {
        transform: `translate(${vPos * 4}%, -${vPos * 4}%) rotate(${vPos}deg) scale(${1 - vPos * 0.04})`,
        zIndex: 40 - numPos, 
        opacity: numPos >= 4 ? 0 : 1 - (vPos * 0.2) 
      }
    }
  }, [])

  const handleNext = useCallback(() => {
    if (state.isAnimating || state.cards.length === 0) return

    // Step 1: Start Animation (swoop out)
    dispatch({ type: 'START_ANIMATION' })

    // Step 2: Remove the card after the 300ms transition finishes
    const t1 = setTimeout(() => {
      dispatch({ type: 'REMOVE_CARD' })
    }, 300)
    
    timeouts.current.push(t1)
  }, [state.isAnimating, state.cards.length])

  const renderedCards = useMemo(() => {
    return state.cards.map((card) => (
      <ArchiveCard 
        key={card.id} 
        card={card} 
        getStyles={getCardStyles} 
      />
    ));
  }, [state.cards, getCardStyles])

  if (images.length === 0) return null

  // Empty State UI
  if (state.cards.length === 0) {
    return (
      <div className="relative w-full aspect-square max-w-[320px] mx-auto mt-4 md:mt-0 flex flex-col items-center justify-center rounded-xl border border-dashed border-[#333] bg-[#0a0a0a]">
        <span className="text-[#666] text-sm mb-4 font-medium tracking-widest uppercase">Archive Empty</span>
        <button 
          onClick={() => dispatch({ type: 'RESET', payload: images })}
          className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#569429] uppercase transition-colors cursor-pointer"
        >
          <RotateCcw size={14} /> Restart
        </button>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full aspect-square max-w-[320px] mx-auto mt-4 md:mt-0" 
      onClick={handleNext}
    >
      {renderedCards}

      {/* Floating Hint */}
      {state.cards.length > 1 && (
        <div className="absolute -bottom-8 left-0 right-0 flex justify-center z-40 pointer-events-none">
          <span className="flex items-center gap-2 text-xs font-bold tracking-widest text-[#569429] uppercase">
            <MousePointerClick size={14} /> Click to explore
          </span>
        </div>
      )}
    </div>
  );
}