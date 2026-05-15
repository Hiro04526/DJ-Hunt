import EBMemberCardClient from "./eb-card-client"
import { EBMember } from "@/types/about-us"

export default async function EBMemberCard({ 
  name, 
  role, 
  image, 
  path,
  title,
  pools
}: EBMember) {

  return (
    <EBMemberCardClient
      name={name}
      role={role}
      image={image}
      path={path} 
      title={title}
      pools={pools}
    />
  )
}