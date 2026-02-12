export function useUsers() {
  const supabase = useSupabaseClient()

  // Shared state using useState key
  const users = useState<any[]>('users-list', () => [])
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

    users.value = data || []
  }

  async function addUser(user: any) {
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
      error.value = err.data?.message || 'Erro ao adicionar usuário.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateUser(user: any) {
    loading.value = true
    error.value = null

    try {
      await $fetch('/api/users', {
        method: 'PUT',
        body: user
      })
      await loadUsers()
    } catch (err: any) {
      console.error(err)
      error.value = err.data?.message || 'Erro ao atualizar usuário.'
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
      error.value = err.data?.message || 'Erro ao excluir usuário.'
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
