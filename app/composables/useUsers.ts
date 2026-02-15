import type { Profile } from "~/types"

export function useUsers() {
  const supabase = useSupabaseClient()

  // Shared state using useState key
  const users = useState<Profile[]>('users-list', () => [])
  const loading = useState<boolean>('users-loading', () => false)
  const error = useState<string | null>('users-error', () => null)

  async function loadUsers() {
    loading.value = true
    error.value = null

    const { data, error: err } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    loading.value = false

    if (err) {
      console.error(err)
      error.value = 'Erro ao carregar usuários.'
      return
    }

    users.value = (data as Profile[]) || []
  }

  async function addUser(user: Omit<Profile, 'created_at' | 'user_id'> & { password?: string }) {
    loading.value = true
    error.value = null

    try {
      await $fetch('/api/users', {
        method: 'POST',
        body: user
      })
      await loadUsers()
    } catch (err: any) {
      console.error(err)
      error.value = err.data?.message || err.message || 'Erro ao adicionar usuário.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateUser(user: Partial<Profile> & { user_id: string }) {
    loading.value = true
    error.value = null

    try {
      await $fetch('/api/users', {
        method: 'PUT',
        body: {
          id: user.user_id,
          name: user.name,
          role: user.role
        }
      })
      await loadUsers()
    } catch (err: any) {
      console.error(err)
      error.value = err.data?.message || err.message || 'Erro ao atualizar usuário.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteUser(userId: string) {
    loading.value = true
    error.value = null

    try {
      await $fetch(`/api/users?id=${userId}`, {
        method: 'DELETE'
      })
      await loadUsers()
    } catch (err: any) {
      console.error(err)
      error.value = err.data?.message || err.message || 'Erro ao excluir usuário.'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    loading,
    error,
    loadUsers,
    addUser,
    updateUser,
    deleteUser
  }
}
