import EBMemberCardClient from "./eb-card-client"
import { EBMember } from "@/types/about-us"

export default async function EBMemberCard({ 
  name, 
  position, 
  image, 
  path,
  title,
  pools
}: EBMember) {

  return (
    <EBMemberCardClient
      name={name}
      position={position}
      image={image}
      path={path} 
      title={title}
      pools={pools}
    />
  )
}