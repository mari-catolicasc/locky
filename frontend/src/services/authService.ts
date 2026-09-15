import type { User } from '../types/user'

const mockUser: User = {
  id: 1,
  name: 'Administrador',
  email: 'admin@locky.com',
  role: 'ADMIN',
}

export function getCurrentUser(): User {
  return mockUser
}

export function isAdmin(): boolean {
  return getCurrentUser().role === 'ADMIN'
}