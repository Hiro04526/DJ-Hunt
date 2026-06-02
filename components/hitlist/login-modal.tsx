"use client"

import { memo } from "react"
import { XCircle } from "lucide-react"
import * as Dialog from "@radix-ui/react-dialog"
import { GoogleLogin } from "@react-oauth/google"
import { LoginModalProps } from "@/types/login"

function LoginModalComponent({ isOpen, onClose, onToken }: LoginModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-sm translate-x-[-50%] translate-y-[-50%] bg-white dark:bg-[#111] border dark:border-white/10 p-8 rounded-3xl shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 focus:outline-none">
          
          <Dialog.Close asChild>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
            >
              <XCircle size={24} />
              <span className="sr-only">Close</span>
            </button>
          </Dialog.Close>

          <Dialog.Title className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-white">
            Sign In
          </Dialog.Title>
          <Dialog.Description className="text-gray-500 dark:text-gray-400 mb-6 text-center text-sm">
            Use your DLSU Email to vote.
          </Dialog.Description>

          <div className="flex justify-center min-h-12.5">
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
              shape="pill"
            />
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export const LoginModal = memo(LoginModalComponent)
