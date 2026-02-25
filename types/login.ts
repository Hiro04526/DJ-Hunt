// --- LOGIN MODAL ---
export interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onToken: (token: any) => void
  ready: boolean // Google script ready status
}