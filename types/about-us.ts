export interface EBMember {
  id: number | null
  name: string
  position: "President" | "Vice President for Internals" | "Vice President for Externals" | 
        "Human Resources" | "Training & Development" | "Formations" | "Pool Director" | null
  image: string | null
  order?: number
  path?: string | null
  title?: string | null
  rt_link?: string
  pools: {
    pool_name: string
    role: string 
  }[]
}

export interface OrgMember {
  id: number | null
  name: string
  image: string | null
  rt_link?: string
  pools: {
    pool_name: string
    role: string 
  }[]
}
