import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDatabase } from './database';

const JWT_SECRET = process.env.JWT_SECRET || 'geosynthesis-secret-key-change-in-production';
const SALT_ROUNDS = 10;

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  last_login: string | null;
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const db = getDatabase();
    
    // Validate input
    if (!username || username.length < 3) {
      return { success: false, message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères' };
    }
    
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Email invalide' };
    }
    
    if (!password || password.length < 6) {
      return { success: false, message: 'Le mot de passe doit contenir au moins 6 caractères' };
    }

    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email);
    if (existingUser) {
      return { success: false, message: 'Nom d\'utilisateur ou email déjà utilisé' };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert user
    const result = db.prepare(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)'
    ).run(username, email, passwordHash);

    const userId = result.lastInsertRowid as number;

    // Get created user
    const user = db.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?').get(userId) as User;

    // Generate token
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '7d'
    });

    return {
      success: true,
      message: 'Compte créé avec succès',
      user,
      token
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'Erreur lors de la création du compte' };
  }
}

export async function loginUser(username: string, password: string): Promise<AuthResult> {
  try {
    const db = getDatabase();

    // Get user
    const user = db.prepare(
      'SELECT id, username, email, password_hash, created_at, last_login FROM users WHERE username = ?'
    ).get(username) as any;

    if (!user) {
      return { success: false, message: 'Nom d\'utilisateur ou mot de passe incorrect' };
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return { success: false, message: 'Nom d\'utilisateur ou mot de passe incorrect' };
    }

    // Update last login
    db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);

    // Generate token
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '7d'
    });

    const { password_hash, ...userWithoutPassword } = user;

    return {
      success: true,
      message: 'Connexion réussie',
      user: userWithoutPassword,
      token
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Erreur lors de la connexion' };
  }
}

export function verifyToken(token: string): { userId: number; username: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; username: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getUserById(userId: number): User | null {
  try {
    const db = getDatabase();
    const user = db.prepare(
      'SELECT id, username, email, created_at, last_login FROM users WHERE id = ?'
    ).get(userId) as User | undefined;
    
    return user || null;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}
