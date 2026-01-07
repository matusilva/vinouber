import type { User } from '~/types'

export function useUsers() {
  const supabase = useSupabaseClient()

  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

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

  return {
    users,
    loading,
    error,
    loadUsers
  }
}
