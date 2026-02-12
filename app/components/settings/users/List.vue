<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { User } from '~/types'

defineProps<{
  users: User[]
}>()

const deleteModal = useTemplateRef('deleteModal')
const editModal = useTemplateRef('editModal')
const selectedUserId = ref<string | undefined>(undefined)
const selectedUser = ref<User | undefined>(undefined)

const { updateUser } = useUsers()
const toast = useToast()

async function onRoleChange(user: User, newRole: string) {
  try {
    // Only update if role changed
    if (user.role === newRole) return

    await updateUser({ ...user, role: newRole })
    toast.add({
      title: 'Sucesso',
      description: 'Função de atualizada',
      color: 'success'
    })
  } catch {
    toast.add({
      title: 'Erro',
      description: 'Erro ao atualizar função',
      color: 'error'
    })
  }
}

// items agora é uma FUNÇÃO que recebe o usuário
const items = (user: User): DropdownMenuItem[] => [
  {
    label: 'Editar usuário',
    icon: 'i-lucide-edit-2',
    onSelect: () => {
      selectedUser.value = user
      editModal.value!.open = true
    }
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
  <ul
    role="list"
    class="divide-y divide-default"
  >
    <li
      v-for="(user, index) in users"
      :key="index"
      class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6"
    >
      <div class="flex items-center gap-3 min-w-0">
        <UAvatar
          v-bind="user.avatar"
          size="md"
        />

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
          @update:model-value="(val) => onRoleChange(user, String(val))"
        />

        <!-- passa o id do usuário para os items -->
        <UDropdownMenu
          :items="items(user)"
          :content="{ align: 'end' }"
        >
          <UButton
            icon="i-lucide-ellipsis-vertical"
            color="neutral"
            variant="ghost"
          />
        </UDropdownMenu>
      </div>
    </li>
  </ul>

  <SettingsUsersDeleteModal
    ref="deleteModal"
    :user-id="selectedUserId"
  />
  <SettingsUsersEditModal
    ref="editModal"
    :user="selectedUser"
  />
</template>
