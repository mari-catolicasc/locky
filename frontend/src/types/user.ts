export type UserRole = 'USER' | 'ADMIN'

export type User = {
  id: number
  name: string
  email: string
  role: UserRole
}