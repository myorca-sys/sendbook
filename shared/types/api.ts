export interface Store {
  id: string
  ownerId: string
  slug: string
  name: string
  description: string | null
  logoUrl: string | null
  address: string | null
  whatsapp: string
  mapsUrl: string | null
  theme: {
    primary: string
    accent: string
  }
  socialLinks: SocialLink[]
  paymentMethods: PaymentMethod[]
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export interface SocialLink {
  platform: string
  url: string
}

export interface PaymentMethod {
  type: "qris" | "bank_transfer" | "e_wallet"
  label: string
  value: string
}

export interface Product {
  id: string
  storeId: string
  name: string
  price: number
  description: string | null
  images: string[]
  category: string | null
  isAvailable: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface AnalyticsSummary {
  totalVisits: number
  totalWhatsappClicks: number
  todayVisits: number
  todayWhatsappClicks: number
  topProducts: { id: string; name: string; views: number }[]
}

export type AnalyticsEventType = "visit" | "whatsapp_click"

export interface AnalyticsEvent {
  id: string
  storeId: string
  type: AnalyticsEventType
  productId?: string
  createdAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
