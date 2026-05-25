export const STAFF_ROLES = ['cleaner', 'supervisor', 'admin'] as const

export type StaffRole = (typeof STAFF_ROLES)[number]

export interface StaffProfile {
  uid: string
  email: string
  displayName: string
  role: StaffRole
  active: boolean
  createdAt: string
  updatedAt: string
}
