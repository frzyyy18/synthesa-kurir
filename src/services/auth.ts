import { sha256 } from 'js-sha256';
import DatabaseService from './database';
import type { User, UserRole, AuthState } from '@/types';

// JWT Simulation
interface JWTPayload {
  userId: string;
  username: string;
  role: UserRole;
  exp: number;
}

const TOKEN_KEY = 'shopee_courier_auth_token_v2';
const USER_KEY = 'shopee_courier_auth_user_v2';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

class AuthService {
  // Hash password using SHA-256
  static hashPassword(password: string): string {
    return sha256(password);
  }

  // Generate JWT token (simulated)
  static generateToken(user: User): string {
    const payload: JWTPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      exp: Date.now() + SESSION_DURATION,
    };
    return btoa(JSON.stringify(payload));
  }

  // Verify and decode token
  static decodeToken(token: string): JWTPayload | null {
    try {
      const payload: JWTPayload = JSON.parse(atob(token));
      if (payload.exp < Date.now()) {
        return null; // Token expired
      }
      return payload;
    } catch {
      return null;
    }
  }

  // Login
  static login(username: string, password: string): { success: boolean; message: string; user?: User; token?: string } {
    const user = DatabaseService.getUserByUsername(username);
    
    if (!user) {
      return { success: false, message: 'Username atau password salah' };
    }

    if (!user.isActive) {
      return { success: false, message: 'Akun Anda telah dinonaktifkan' };
    }

    const hashedPassword = this.hashPassword(password);
    if (user.password !== hashedPassword) {
      return { success: false, message: 'Username atau password salah' };
    }

    // Update last login
    DatabaseService.updateUser(user.id, { lastLogin: new Date().toISOString() });

    // Generate token
    const token = this.generateToken(user);
    
    // Store in localStorage
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    // Log activity
    DatabaseService.createActivityLog({
      userId: user.id,
      userName: user.name,
      action: 'login',
      entityType: 'user',
      entityId: user.id,
      description: `User ${user.username} berhasil login`,
    });

    return { success: true, message: 'Login berhasil', user, token };
  }

  // Logout
  static logout(): void {
    const user = this.getCurrentUser();
    if (user) {
      DatabaseService.createActivityLog({
        userId: user.id,
        userName: user.name,
        action: 'logout',
        entityType: 'user',
        entityId: user.id,
        description: `User ${user.username} logout`,
      });
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  // Get current user
  static getCurrentUser(): User | null {
    const userJson = localStorage.getItem(USER_KEY);
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  // Get current token
  static getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // Check if authenticated
  static isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    const payload = this.decodeToken(token);
    if (!payload) {
      this.logout();
      return false;
    }
    return true;
  }

  // Check if user has role
  static hasRole(role: UserRole | UserRole[]): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  }

  // Get auth state
  static getAuthState(): AuthState {
    const isAuthenticated = this.isAuthenticated();
    const user = this.getCurrentUser();
    const token = this.getToken();
    
    return {
      isAuthenticated,
      user,
      token,
      role: user?.role || null,
    };
  }

  // Change password
  static changePassword(userId: string, oldPassword: string, newPassword: string): { success: boolean; message: string } {
    const user = DatabaseService.getUserById(userId);
    if (!user) {
      return { success: false, message: 'User tidak ditemukan' };
    }

    const hashedOldPassword = this.hashPassword(oldPassword);
    if (user.password !== hashedOldPassword) {
      return { success: false, message: 'Password lama salah' };
    }

    const hashedNewPassword = this.hashPassword(newPassword);
    DatabaseService.updateUser(userId, { password: hashedNewPassword });

    DatabaseService.createActivityLog({
      userId: user.id,
      userName: user.name,
      action: 'update',
      entityType: 'user',
      entityId: user.id,
      description: `User ${user.username} mengubah password`,
    });

    return { success: true, message: 'Password berhasil diubah' };
  }
}

export default AuthService;
