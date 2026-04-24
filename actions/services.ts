"use server"

import { ContactFormData, ActionResponse } from "@/types/services"

export async function submitContactFormAction(data: ContactFormData): Promise<ActionResponse> {
  try {
    // 1. Check if the API key is actually loaded
    const apiKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!apiKey) {
      console.error("CRITICAL ERROR: WEB3FORMS_ACCESS_KEY is missing from .env")
      return { success: false, error: "Server configuration error. Please contact support." }
    }

    if (!data.title || !data.name || !data.email || !data.subject || !data.message) {
      return { success: false, error: "All fields are required." }
    }

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: apiKey, 
        subject: `New GGFM Inquiry: ${data.subject}`,
        from_name: `${data.title} ${data.name}`,
        email: data.email, 
        replyto: data.email,
        message: data.message,
      }),
    });

    // 2. Catch HTML responses before they crash the JSON parser
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.error("Web3Forms sent back HTML instead of JSON. Here is the page:", textResponse);
      return { success: false, error: "Email service is temporarily down." }
    }

    const result = await response.json();

    if (!result.success) {
      console.error("Web3Forms API Error:", result);
      return { success: false, error: result.message || "Failed to send message." }
    }

    return { success: true }
  } catch (error) {
    console.error("Submission error:", error)
    return { success: false, error: "An unexpected error occurred." }
  }
}