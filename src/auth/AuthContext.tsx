import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { auth, db } from '../config/firebase'
import { hasFirebaseConfig } from '../config/env'
import type { StaffProfile, StaffRole } from '../types/auth'
import { AuthContext, type AuthContextValue } from './context'

const baseProfile = (
  uid: string,
  email: string,
  displayName: string,
  role: StaffRole,
): Omit<StaffProfile, 'createdAt' | 'updatedAt'> => ({
  uid,
  email,
  displayName,
  role,
  active: true,
})

const mapProfile = (
  data: Partial<StaffProfile> | undefined,
  uid: string,
): StaffProfile | null => {
  if (!data?.email || !data.role || !data.displayName) {
    return null
  }

  return {
    uid,
    email: data.email,
    role: data.role,
    active: data.active ?? true,
    displayName: data.displayName,
    createdAt: data.createdAt ?? '',
    updatedAt: data.updatedAt ?? '',
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<StaffProfile | null>(null)
  const [loading, setLoading] = useState(hasFirebaseConfig)

  const hydrateProfile = useCallback(async (firebaseUser: User) => {
    const ref = doc(db, 'staffProfiles', firebaseUser.uid)
    const snapshot = await getDoc(ref)

    if (!snapshot.exists()) {
      const payload = {
        ...baseProfile(
          firebaseUser.uid,
          firebaseUser.email ?? '',
          firebaseUser.displayName ?? 'Cleaner',
          'cleaner',
        ),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdAtServer: serverTimestamp(),
        updatedAtServer: serverTimestamp(),
      }
      await setDoc(ref, payload)
      setProfile(mapProfile(payload, firebaseUser.uid))
      return
    }

    const profileData = snapshot.data() as Partial<StaffProfile>
    setProfile(mapProfile(profileData, firebaseUser.uid))
  }, [])

  useEffect(() => {
    if (!hasFirebaseConfig) {
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser)
      if (!nextUser) {
        setProfile(null)
        setLoading(false)
        return
      }

      await hydrateProfile(nextUser)
      setLoading(false)
    })

    return unsubscribe
  }, [hydrateProfile])

  const signInHandler = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }, [])

  const registerCleaner = useCallback(
    async (email: string, password: string, displayName: string) => {
      const credentials = await createUserWithEmailAndPassword(auth, email, password)
      const ref = doc(db, 'staffProfiles', credentials.user.uid)
      const payload = {
        ...baseProfile(credentials.user.uid, email, displayName || 'Cleaner', 'cleaner'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdAtServer: serverTimestamp(),
        updatedAtServer: serverTimestamp(),
      }
      await setDoc(ref, payload)
      setProfile(mapProfile(payload, credentials.user.uid))
    },
    [],
  )

  const signOutHandler = useCallback(async () => {
    await signOut(auth)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      signIn: signInHandler,
      registerCleaner,
      signOutCurrentUser: signOutHandler,
      hasFirebaseConfig,
    }),
    [loading, profile, registerCleaner, signInHandler, signOutHandler, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
