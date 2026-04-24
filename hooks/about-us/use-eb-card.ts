import { useReducer, useMemo, useCallback, ChangeEvent } from "react"
import { BoardMember } from "@/types/about-us"

export type FilterType = 'all' | 'top3' | 'vpi manager' | 'pool director'

type State = { query: string; filter: FilterType }
type Action = 
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_FILTER'; payload: FilterType }

function boardReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_QUERY': return { ...state, query: action.payload }
    case 'SET_FILTER': return { ...state, filter: action.payload }
    default: return state
  }
}

export function useExecutiveBoard(members: BoardMember[]) {
  const [state, dispatch] = useReducer(boardReducer, { query: '', filter: 'all' })

  const handleSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_QUERY', payload: e.target.value })
  }, [])

  const handleFilter = useCallback((filterType: FilterType) => {
    dispatch({ type: 'SET_FILTER', payload: filterType })
  }, [])

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesQuery = member.name.toLowerCase().includes(state.query.toLowerCase()) || 
                           member.position.toLowerCase().includes(state.query.toLowerCase())
      
      const matchesFilter = state.filter === 'all' || member.category === state.filter

      return matchesQuery && matchesFilter
    })
  }, [members, state.query, state.filter])

  const top3 = filteredMembers.filter(m => m.category === 'top3')
  const vpiManagers = filteredMembers.filter(m => m.category === 'vpi manager')
  const poolDirectors = filteredMembers.filter(m => m.category === 'pool director')

  return {
    query: state.query,
    filter: state.filter,
    handleSearch,
    handleFilter,
    top3,
    vpiManagers,
    poolDirectors,
    isEmpty: filteredMembers.length === 0
  }
}