import { getDJsAction } from "@/app/actions/dj-hunt"

export async function getDJs() {
  const result = await getDJsAction()
  
  if (!result.success || !result.data) {
    console.error("Failed to load DJs:", result.error)
    return []
  }
  
  return result.data
}