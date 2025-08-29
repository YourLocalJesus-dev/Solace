import { User } from '../types';

const ADMIN_EMAILS = ['nilaymishra2011@gmail.com', 'nilay2011op@gmail.com'];

export const isAdminEmail = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

export const setAuthCookie = (user: User): void => {
  const expires = new Date();
  expires.setDate(expires.getDate() + 30); // 30 days
  document.cookie = `auth=${JSON.stringify(user)}; expires=${expires.toUTCString()}; path=/`;
};

export const getAuthCookie = (): User | null => {
  const cookies = document.cookie.split(';');
  const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth='));
  
  if (authCookie) {
    try {
      const userStr = authCookie.split('=')[1];
      return JSON.parse(decodeURIComponent(userStr));
    } catch {
      return null;
    }
  }
  
  return null;
};

export const removeAuthCookie = (): void => {
  document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const simulateGoogleLogin = async (email: string): Promise<User> => {
  const user: User = {
    id: generateId(),
    email,
    username: email.split('@')[0],
    profilePicture: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`,
    createdAt: new Date().toISOString(),
    isAdmin: isAdminEmail(email)
  };
  
  setAuthCookie(user);
  return user;
};