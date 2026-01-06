export const useAuth = () => {
  const supabaseClient = useSupabaseClient()

  const login = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  const register = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signUp({
      email,
      password
    })

    if (error) {
      throw new Error(error.message)
    }
  }

  const logout = async () => {
    const { error } = await supabaseClient.auth.signOut()

    if (error) {
      throw new Error(error.message)
    }
  }

  return {
    login,
    register,
    logout
  }
}
