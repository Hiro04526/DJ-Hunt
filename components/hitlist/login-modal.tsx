"use client"

import { memo, useEffect, useState } from "react"
import { XCircle } from "lucide-react"
import * as Dialog from "@radix-ui/react-dialog"
import { GoogleLogin } from "@react-oauth/google"
import { LoginModalProps } from "@/types/login"

function LoginModalComponent({ isOpen, onClose, onToken }: LoginModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        {/* We keep the dark overlay to contrast the bright modal */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        {/* Forced bg-white and removed all dark mode overrides */}
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-sm translate-x-[-50%] translate-y-[-50%] bg-white border border-gray-200 p-8 rounded-3xl shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 focus:outline-none">
          
          <Dialog.Close asChild>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
            >
              <XCircle size={24} />
              <span className="sr-only">Close</span>
            </button>
          </Dialog.Close>

          {/* Forced dark text */}
          <Dialog.Title className="text-2xl font-bold mb-2 text-center text-gray-900">
            Sign In
          </Dialog.Title>
          <Dialog.Description className="text-gray-500 mb-6 text-center text-sm">
            Use your DLSU Email to vote.
          </Dialog.Description>

          {/* Since the modal is white, we just need a simple flex container to center it */}
          <div className="flex justify-center">
            {mounted && (
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (credentialResponse.credential) {
                    try {
                      await onToken({ credential: credentialResponse.credential })
                      onClose()
                    } catch (error) {
                      console.error("Authentication submission error:", error)
                    }
                  }
                }}
                onError={() => console.error("Google login failed")}
                use_fedcm_for_button={true}
                use_fedcm_for_prompt={true}
                theme="outline" 
                // You can safely change this back to "pill" now since the white corners will be invisible!
                shape="pill" 
              />
            )}
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export const LoginModal = memo(LoginModalComponent)