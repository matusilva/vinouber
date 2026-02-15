export type UserRole = 'user' | 'admin'

export interface Profile {
  user_id: string
  email: string
  name: string
  role: UserRole
  created_at: string
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: {
    src: string
    alt: string
  }
  created_at: string
}
