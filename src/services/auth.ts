import { supabase } from "@/lib/supabase"
import { sha256 } from "js-sha256"

export interface AuthState {
  isAuthenticated: boolean
  user: any | null
  token: string | null
  role: string | null
}

class AuthService {

  static hashPassword(password: string): string {
    return sha256(password)
  }

  static async changePassword(userId: string, oldPassword: string, newPassword: string) {
    try {
      // Get current user
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single()

      if (userError || !user) {
        return { success: false, message: "User tidak ditemukan" }
      }

      // Verify old password
      const hashedOldPassword = sha256(oldPassword)
      if (user.password !== hashedOldPassword) {
        return { success: false, message: "Password lama salah" }
      }

      // Update password
      const hashedNewPassword = sha256(newPassword)
      const { error: updateError } = await supabase
        .from("users")
        .update({ password: hashedNewPassword })
        .eq("id", userId)

      if (updateError) {
        return { success: false, message: "Gagal mengubah password" }
      }

      return { success: true, message: "Password berhasil diubah" }
    } catch (error: any) {
      return { success: false, message: error.message || "Terjadi kesalahan" }
    }
  }

  static async login(username: string, password: string) {

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single()

    if (error || !data) {
      return { success: false, message: "Username atau password salah" }
    }

    const hashedPassword = sha256(password)

    if (data.password !== hashedPassword) {
      return { success: false, message: "Username atau password salah" }
    }

    localStorage.setItem("auth_user", JSON.stringify(data))

    return {
      success: true,
      message: "Login berhasil",
      user: data
    }
  }

  static logout() {
    localStorage.removeItem("auth_user")
  }

  static getCurrentUser() {

    const user = localStorage.getItem("auth_user")

    if (!user) return null

    return JSON.parse(user)
  }

  static isAuthenticated() {

    const user = this.getCurrentUser()

    return !!user
  }

  static hasRole(role: string | string[]) {

    const user = this.getCurrentUser()

    if (!user) return false

    if (Array.isArray(role)) {
      return role.includes(user.role)
    }

    return user.role === role
  }

  static getAuthState(): AuthState {

    const user = this.getCurrentUser()

    return {
      isAuthenticated: !!user,
      user,
      token: null,
      role: user?.role || null
    }
  }

}

export default AuthService