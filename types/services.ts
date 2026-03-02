// --- SERVICE ITEM ---
export interface ServiceItem {
  id: string
  title: string
  icon: string
  description: string
  subServices: string[]
  color: string
  primerUrl?: string
  sampleTabs?: ServiceTab[]
}

// --- SERVICE CARD STUFF ---
export interface ServiceCardProps {
  service: ServiceItem
  isExpanded: boolean
  onToggle: () => void
  onInquireClick?: (subject: string) => void
}

export interface ServicesGridProps {
  onInquireClick: (subject: string) => void;
}

export interface ServiceMedia {
  type: 'image' | 'video';
  url: string;
  orientation: 'vertical' | 'horizontal';
}

export interface ServiceTab {
  name: string;
  media: ServiceMedia[];
}

// --- CONTACT FORM STUFF ---
export interface ContactFormData {
  title: string
  name: string
  email: string
  subject: string
  message: string
}

export interface ActionResponse {
  success: boolean
  error?: string
}

export interface ContactFormProps {
  onSuccess: () => void
  prefilledSubject?: string 
}

export interface ContactSuccessProps {
  onReset: () => void
}

export interface ServicesCTAProps {
  prefilledSubject?: string;
}