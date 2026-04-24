export interface BoardMember {
  id: number
  name: string
  position: string
  category: 'top3' | 'vpi manager' | 'pool director'
  image_url: string | null
  order?: number
}
