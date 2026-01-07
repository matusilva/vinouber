import type { User } from '@supabase/supabase-js'

export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = ref<User | null>(null)

  const loadAuthUser = async () => {
    const { data } = await supabase.auth.getUser()
    user.value = data.user
  }

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw new Error(error.message)
    user.value = data.user
  }

  const register = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) throw new Error(error.message)
    user.value = data.user
  }

  const logout = async () => {
    await supabase.auth.signOut()
    user.value = null
  }

  loadAuthUser()

  return {
    user,
    loadAuthUser,
    login,
    register,
    logout
  }
}
