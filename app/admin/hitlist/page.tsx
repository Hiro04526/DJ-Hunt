import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import AddSongsClientComponent from "./client-page"

export default async function AdminPageWrapper() {
  // 1. Get the cookie store (must await in Next.js 15)
  const cookieStore = await cookies()
  
  // 2. Check if the "admin" cookie exists and equals "1"
  const isAdmin = cookieStore.get("admin")?.value === "1"

  // 3. If they don't have the cookie, kick them to the login page
  if (!isAdmin) {
    redirect("/admin/login")
  }

  // 4. If they pass, render the client page
  return <AddSongsClientComponent />
}