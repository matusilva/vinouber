<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { User } from '~/types'

defineProps<{
  users: User[]
}>()

const deleteModal = useTemplateRef('deleteModal')
const selectedUserId = ref<string | undefined>(undefined)

// items agora é uma FUNÇÃO que recebe o id do usuário
const items = (user: User): DropdownMenuItem[] => [
  {
    label: 'Editar usuário',
    icon: 'i-lucide-edit-2',
    onSelect: () => console.log('Edit user')
  },
  {
    label: 'Excluir usuário',
    icon: 'i-lucide-trash',
    color: 'error' as const,
    onSelect() {
      selectedUserId.value = user.id
      deleteModal.value!.open = true
    }
  }
]
</script>

<template>
  <ul role="list" class="divide-y divide-default">
    <li
      v-for="(user, index) in users"
      :key="index"
      class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6"
    >
      <div class="flex items-center gap-3 min-w-0">
        <UAvatar v-bind="user.avatar" size="md" />

        <div class="text-sm min-w-0">
          <p class="text-highlighted font-medium truncate">
            {{ user.name }}
          </p>
          <p class="text-muted truncate">
            {{ user.email }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <USelect
          :model-value="user.role"
          :items="['user', 'admin']"
          color="neutral"
          :ui="{ value: 'capitalize', item: 'capitalize' }"
        />

        <!-- passa o id do usuário para os items -->
        <UDropdownMenu :items="items(user)" :content="{ align: 'end' }">
          <UButton
            icon="i-lucide-ellipsis-vertical"
            color="neutral"
            variant="ghost"
          />
        </UDropdownMenu>
      </div>
    </li>
  </ul>

  <SettingsUsersDeleteModal ref="deleteModal" :user-id="selectedUserId" />
</template>
