import type { User, Registration, Document, ActivityLog, DashboardStats } from '@/types';

// Database keys for localStorage
const DB_KEYS = {
  USERS: 'shopee_courier_db_users_v2',
  REGISTRATIONS: 'shopee_courier_db_registrations_v2',
  DOCUMENTS: 'shopee_courier_db_documents_v2',
  ACTIVITY_LOGS: 'shopee_courier_db_activity_logs_v2',
};

// Generic CRUD operations
class DatabaseService {
  // Initialize database with default data
  static init(): void {
    if (!localStorage.getItem(DB_KEYS.USERS)) {
      // Create default admin user (password: admin123)
      // SHA256 hash for "admin123"
      const defaultAdmin: User = {
        id: this.generateId(),
        username: 'admin',
        email: 'admin@shopee.com',
        password: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', // admin123 (SHA256)
        role: 'admin',
        name: 'Administrator',
        phone: '081234567890',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Create default PIC user (password: pic123)
      // SHA256 hash for "pic123"
      const defaultPIC: User = {
        id: this.generateId(),
        username: 'pic',
        email: 'pic@shopee.com',
        password: 'cddf92e0391b2993763805d459ea111f63e15f434ee6e3b65b14281412368f7e', // pic123 (SHA256)
        role: 'pic',
        name: 'PIC Verifikator',
        phone: '081234567891',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify([defaultAdmin, defaultPIC]));
    }

    if (!localStorage.getItem(DB_KEYS.REGISTRATIONS)) {
      localStorage.setItem(DB_KEYS.REGISTRATIONS, JSON.stringify([]));
    }

    if (!localStorage.getItem(DB_KEYS.DOCUMENTS)) {
      localStorage.setItem(DB_KEYS.DOCUMENTS, JSON.stringify([]));
    }

    if (!localStorage.getItem(DB_KEYS.ACTIVITY_LOGS)) {
      localStorage.setItem(DB_KEYS.ACTIVITY_LOGS, JSON.stringify([]));
    }
  }

  static generateId(): string {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  static generateRegistrationCode(): string {
    const prefix = 'SPX';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  // Users
  static getUsers(): User[] {
    return JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
  }

  static getUserById(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  static getUserByUsername(username: string): User | undefined {
    return this.getUsers().find(u => u.username === username);
  }

  static getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email === email);
  }

  static createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...user,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    return newUser;
  }

  static updateUser(id: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    return users[index];
  }

  // Registrations
  static getRegistrations(): Registration[] {
    return JSON.parse(localStorage.getItem(DB_KEYS.REGISTRATIONS) || '[]');
  }

  static getRegistrationById(id: string): Registration | undefined {
    return this.getRegistrations().find(r => r.id === id);
  }

  static getRegistrationByCode(code: string): Registration | undefined {
    return this.getRegistrations().find(r => r.registrationCode === code);
  }

  static createRegistration(registration: Omit<Registration, 'id' | 'registrationCode' | 'submittedAt' | 'documents'>): Registration {
    const registrations = this.getRegistrations();
    const newRegistration: Registration = {
      ...registration,
      id: this.generateId(),
      registrationCode: this.generateRegistrationCode(),
      submittedAt: new Date().toISOString(),
      documents: [],
    };
    registrations.push(newRegistration);
    localStorage.setItem(DB_KEYS.REGISTRATIONS, JSON.stringify(registrations));
    return newRegistration;
  }

  static updateRegistration(id: string, updates: Partial<Registration>): Registration | null {
    const registrations = this.getRegistrations();
    const index = registrations.findIndex(r => r.id === id);
    if (index === -1) return null;
    registrations[index] = { ...registrations[index], ...updates };
    localStorage.setItem(DB_KEYS.REGISTRATIONS, JSON.stringify(registrations));
    return registrations[index];
  }

  // Documents
  static getDocuments(): Document[] {
    return JSON.parse(localStorage.getItem(DB_KEYS.DOCUMENTS) || '[]');
  }

  static getDocumentsByRegistrationId(registrationId: string): Document[] {
    return this.getDocuments().filter(d => d.registrationId === registrationId);
  }

  static createDocument(document: Omit<Document, 'id'>): Document {
    const documents = this.getDocuments();
    const newDocument: Document = {
      ...document,
      id: this.generateId(),
    };
    documents.push(newDocument);
    localStorage.setItem(DB_KEYS.DOCUMENTS, JSON.stringify(documents));
    
    // Update registration documents array
    const registration = this.getRegistrationById(document.registrationId);
    if (registration) {
      registration.documents.push(newDocument);
      this.updateRegistration(registration.id, { documents: registration.documents });
    }
    
    return newDocument;
  }

  static updateDocument(id: string, updates: Partial<Document>): Document | null {
    const documents = this.getDocuments();
    const index = documents.findIndex(d => d.id === id);
    if (index === -1) return null;
    documents[index] = { ...documents[index], ...updates };
    localStorage.setItem(DB_KEYS.DOCUMENTS, JSON.stringify(documents));
    return documents[index];
  }

  // Activity Logs
  static getActivityLogs(): ActivityLog[] {
    return JSON.parse(localStorage.getItem(DB_KEYS.ACTIVITY_LOGS) || '[]');
  }

  static createActivityLog(log: Omit<ActivityLog, 'id' | 'timestamp'>): ActivityLog {
    const logs = this.getActivityLogs();
    const newLog: ActivityLog = {
      ...log,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
    };
    logs.unshift(newLog);
    // Keep only last 1000 logs
    if (logs.length > 1000) logs.pop();
    localStorage.setItem(DB_KEYS.ACTIVITY_LOGS, JSON.stringify(logs));
    return newLog;
  }

  // Dashboard Stats
  static getDashboardStats(): DashboardStats {
    const registrations = this.getRegistrations();
    const users = this.getUsers();
    
    const today = new Date().toISOString().split('T')[0];
    const todayRegistrations = registrations.filter(r => r.submittedAt.startsWith(today)).length;

    return {
      totalRegistrations: registrations.length,
      pendingRegistrations: registrations.filter(r => r.status === 'pending').length,
      verifiedRegistrations: registrations.filter(r => r.status === 'verified').length,
      approvedRegistrations: registrations.filter(r => r.status === 'approved').length,
      rejectedRegistrations: registrations.filter(r => r.status === 'rejected').length,
      todayRegistrations,
      totalPICs: users.filter(u => u.role === 'pic').length,
    };
  }

  // Clear all data (for testing)
  static clearAll(): void {
    Object.values(DB_KEYS).forEach(key => localStorage.removeItem(key));
  }
}

export default DatabaseService;
