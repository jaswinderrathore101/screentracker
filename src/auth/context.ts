import { createContext } from 'react'
import type { User } from 'firebase/auth'
import type { StaffProfile } from '../types/auth'

export type AuthContextValue = {
  user: User | null
  profile: StaffProfile | null
  loading: boolean
  hasFirebaseConfig: boolean
  signIn: (email: string, password: string) => Promise<void>
  registerCleaner: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<void>
  signOutCurrentUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
