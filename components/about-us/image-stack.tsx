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

type Action =
  | { type: 'START_ANIMATION' }
  | { type: 'REMOVE_CARD' }
  | { type: 'RESET'; payload: string[] }

function stackReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'START_ANIMATION':
      return {
        ...state,
        isAnimating: true,
        cards: state.cards.map(card => {
          if (card.pos === 0) return { ...card, pos: 'swoop-out' }
          if (typeof card.pos === 'number' && card.pos > 0) return { ...card, pos: card.pos - 1 }
          return card
        })
      };
    case 'REMOVE_CARD':
      return {
        isAnimating: false,
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
    // Colors updated to the brand's dark palette (#363636 / #252525 / #191919)
    // in place of the previous ad-hoc #222 / #111 / #0a0a0a.
    const baseClasses = "absolute top-0 left-0 w-full h-full object-cover rounded-xl border border-[#363636] bg-[#252525] shadow-xl transition duration-300 ease-out origin-center cursor-pointer"

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

    dispatch({ type: 'START_ANIMATION' })

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

  if (state.cards.length === 0) {
    return (
      <div className="relative mx-auto mt-4 flex aspect-square w-full max-w-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-[#363636] bg-[#191919] md:mt-0">
        <span className="mb-4 font-secondary text-sm font-medium uppercase tracking-widest text-[#646464]">
          Archive Empty
        </span>
        <button
          onClick={() => dispatch({ type: 'RESET', payload: images })}
          className="flex items-center gap-2 font-secondary text-xs font-bold uppercase tracking-widest text-[#569429] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#569429] rounded"
        >
          <RotateCcw size={14} /> Restart
        </button>
      </div>
    );
  }

  return (
    <div
      className="relative mx-auto mt-4 aspect-square w-full max-w-[320px] md:mt-0"
      onClick={handleNext}
    >
      {renderedCards}

      {state.cards.length > 1 && (
        <div className="pointer-events-none absolute -bottom-8 left-0 right-0 z-40 flex justify-center">
          <span className="flex items-center gap-2 font-secondary text-xs font-bold uppercase tracking-widest text-[#569429]">
            <MousePointerClick size={14} /> Click to explore
          </span>
        </div>
      )}
    </div>
  );
}