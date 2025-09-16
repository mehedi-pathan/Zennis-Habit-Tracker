"use client"

export interface User {
  id: string
  email: string
  name: string
  isGuest: boolean
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isGuest: boolean
}

const AUTH_STORAGE_KEY = "zennis_auth"
const GUEST_USER_KEY = "zennis_guest_user"

export class AuthService {
  static getAuthState(): AuthState {
    if (typeof window === "undefined") {
      return { user: null, isAuthenticated: false, isGuest: false }
    }

    const authData = localStorage.getItem(AUTH_STORAGE_KEY)
    const guestData = localStorage.getItem(GUEST_USER_KEY)

    if (authData) {
      const user = JSON.parse(authData)
      return { user, isAuthenticated: true, isGuest: false }
    }

    if (guestData) {
      const user = JSON.parse(guestData)
      return { user, isAuthenticated: true, isGuest: true }
    }

    return { user: null, isAuthenticated: false, isGuest: false }
  }

  static async signup(email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if user already exists
      const existingUsers = this.getAllUsers()
      if (existingUsers.find((u) => u.email === email)) {
        return { success: false, error: "User with this email already exists" }
      }

      // Create new user
      const user: User = {
        id: crypto.randomUUID(),
        email,
        name,
        isGuest: false,
        createdAt: new Date().toISOString(),
      }

      // Store user credentials (in real app, this would be hashed)
      const users = [...existingUsers, { ...user, password }]
      localStorage.setItem("zennis_users", JSON.stringify(users))

      // Set current user
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
      localStorage.removeItem(GUEST_USER_KEY)

      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to create account" }
    }
  }

  static async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const users = this.getAllUsers()
      const user = users.find((u) => u.email === email && u.password === password)

      if (!user) {
        return { success: false, error: "Invalid email or password" }
      }

      // Remove password from stored user data
      const { password: _, ...userWithoutPassword } = user
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithoutPassword))
      localStorage.removeItem(GUEST_USER_KEY)

      return { success: true }
    } catch (error) {
      return { success: false, error: "Failed to login" }
    }
  }

  static continueAsGuest(name?: string): { success: boolean } {
    const guestUser: User = {
      id: crypto.randomUUID(),
      email: "",
      name: name || "Guest User",
      isGuest: true,
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem(GUEST_USER_KEY, JSON.stringify(guestUser))
    localStorage.removeItem(AUTH_STORAGE_KEY)

    return { success: true }
  }

  static logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    localStorage.removeItem(GUEST_USER_KEY)
  }

  static upgradeGuestAccount(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    const authState = this.getAuthState()
    if (!authState.isGuest || !authState.user) {
      return Promise.resolve({ success: false, error: "No guest account to upgrade" })
    }

    // Convert guest to regular user
    const upgradedUser: User = {
      ...authState.user,
      email,
      isGuest: false,
    }

    return this.signup(email, password, authState.user.name)
  }

  private static getAllUsers(): Array<User & { password: string }> {
    if (typeof window === "undefined") return []

    const users = localStorage.getItem("zennis_users")
    return users ? JSON.parse(users) : []
  }
}
