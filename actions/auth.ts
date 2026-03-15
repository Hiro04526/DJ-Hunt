"use server"

import { cookies } from "next/headers"

export async function adminLoginAction(password: string) {
  // 1. Check if password matches the env variable
  if (password === process.env.ADMIN_ACCESS_PASSWORD) {
    
    // 2. Set the cookie (valid for 1 day)
    const cookieStore = await cookies()
    cookieStore.set("admin", "1", { 
      path: "/", 
      maxAge: 60 * 60 * 24, // 1 day
      httpOnly: true,       // Secure: JavaScript can't read this
      sameSite: "lax" 
    })

    return { success: true }
  }

  return { success: false, error: "Incorrect password" }
}

export async function adminLogoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("admin")
  return { success: true }
}