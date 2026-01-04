import { createSharedComposable } from '@vueuse/core'

const _useDashboard = () => {
  const route = useRoute()
  const router = useRouter()

  defineShortcuts({
    'g-h': () => router.push('/'),
    'g-u': () => router.push('/users'),
    'g-s': () => router.push('/settings'),
  })
}

export const useDashboard = createSharedComposable(_useDashboard)
