<script setup lang="ts">
import type { User } from '~/types'

const { users, loadUsers } = useUsers()

await loadUsers()

const q = ref('')

const data = computed<User[]>(() =>
  users.value.map((u) => ({
    id: u.user_id,
    name: u.name || 'Usuário',
    email: u.email || '',
    avatar: {
      src: `https://api.dicebear.com/8.x/initials/svg?seed=${
        u.name || u.email
      }`,
      alt: u.name || u.email
    },
    role: u.role || 'user'
  }))
)

const filteredUsers = computed(() =>
  data.value.filter(
    (user) =>
      user.name.match(new RegExp(q.value, 'i')) ||
      user.email.match(new RegExp(q.value, 'i'))
  )
)
</script>

<template>
  <div>
    <UPageCard
      title="Usuários"
      description="Gerencie os usuários do sistema."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <SettingsUsersAddModal class="w-fit lg:ms-auto" />
    </UPageCard>

    <UPageCard
      variant="subtle"
      :ui="{
        container: 'p-0 sm:p-0 gap-y-0',
        wrapper: 'items-stretch',
        header: 'p-4 mb-0 border-b border-default'
      }"
    >
      <template #header>
        <UInput
          v-model="q"
          icon="i-lucide-search"
          placeholder="Buscar usuários"
          autofocus
          class="w-full"
        />
      </template>

      <SettingsUsersList :users="filteredUsers" />
    </UPageCard>
  </div>
</template>
