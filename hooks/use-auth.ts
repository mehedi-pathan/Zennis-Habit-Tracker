"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { AuthService, type AuthState } from "@/lib/auth"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  continueAsGuest: (name?: string) => void
  upgradeGuestAccount: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  refreshAuth: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function useAuthState() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isGuest: false,
  })

  const refreshAuth = () => {
    const newAuthState = AuthService.getAuthState()
    setAuthState(newAuthState)
  }

  useEffect(() => {
    refreshAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const result = await AuthService.login(email, password)
    if (result.success) {
      refreshAuth()
    }
    return result
  }

  const signup = async (email: string, password: string, name: string) => {
    const result = await AuthService.signup(email, password, name)
    if (result.success) {
      refreshAuth()
    }
    return result
  }

  const logout = () => {
    AuthService.logout()
    refreshAuth()
  }

  const continueAsGuest = (name?: string) => {
    AuthService.continueAsGuest(name)
    refreshAuth()
  }

  const upgradeGuestAccount = async (email: string, password: string) => {
    const result = await AuthService.upgradeGuestAccount(email, password)
    if (result.success) {
      refreshAuth()
    }
    return result
  }

  return {
    ...authState,
    login,
    signup,
    logout,
    continueAsGuest,
    upgradeGuestAccount,
    refreshAuth,
  }
}

export { AuthContext }
