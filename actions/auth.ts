"use server"

import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import { OAuth2Client } from "google-auth-library"

// --- CONFIGURATION & SECRETS ---
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID)

const ADMIN_COOKIE = "admin_session"
const USER_COOKIE = "user_session"

const ADMIN_SECRET = new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET as string)
const USER_SECRET = new TextEncoder().encode(process.env.SESSION_SECRET as string)

// ==========================================
//           ADMIN AUTHENTICATION
// ==========================================

export async function adminLoginAction(password: string) {
  if (password === process.env.ADMIN_PASSWORD) {
    const token = await new SignJWT({ role: "admin", authorized: true })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(ADMIN_SECRET)

    const cookieStore = await cookies()
    cookieStore.set(ADMIN_COOKIE, token, { 
      path: "/", 
      maxAge: 60 * 60 * 24 * 7, 
      httpOnly: true,       
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" 
    })

    return { success: true }
  }

  return { success: false, error: "Incorrect password" }
}

export async function adminLogoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_COOKIE)
  return { success: true }
}

export async function verifyAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value
  if (!token) return false

  try {
    await jwtVerify(token, ADMIN_SECRET)
    return true
  } catch (error) {
    return false
  }
}

// ==========================================
//         PUBLIC USER AUTHENTICATION
// ==========================================

export async function loginAction(token: string) {
  try {
    const ticket = await googleClient.verifyIdToken({ idToken: token, audience: GOOGLE_CLIENT_ID })
    const email = ticket.getPayload()?.email
    if (!email) throw new Error("Invalid Token")

    const sessionToken = await new SignJWT({ email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(USER_SECRET)

    const cookieStore = await cookies()
    cookieStore.set(USER_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, 
      path: "/",
    })
    
    return { success: true, email }
  } catch (e) {
    return { success: false, error: "Login failed" }
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete(USER_COOKIE)
  return { success: true }
}

export async function getEmailFromSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(USER_COOKIE)?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, USER_SECRET)
    return payload.email as string
  } catch (error) {
    return null
  }
}