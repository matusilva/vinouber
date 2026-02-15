export type UserRole = 'user' | 'admin'

export interface Profile {
  user_id: string
  email: string
  name: string
  role: UserRole
  created_at: string
}

export type User = Profile
