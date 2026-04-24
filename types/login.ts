// --- LOGIN MODAL ---
export interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onToken: (token: any) => void
}