<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { User } from '~/types'

const props = defineProps<{
  user?: User
}>()

const { updateUser, loading } = useUsers()
const toast = useToast()

const schema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Muito curto'),
  role: z.enum(['user', 'admin'])
})

type Schema = z.output<typeof schema>
const open = ref(false)

const state = reactive<Partial<Schema>>({
  id: undefined,
  name: undefined,
  role: undefined
})

watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      state.id = newUser.id
      state.name = newUser.name
      state.role = newUser.role
    }
  }
)

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await updateUser(event.data)
    toast.add({
      title: 'Sucesso',
      description: `Usuário ${event.data.name} atualizado com sucesso`,
      color: 'success'
    })
    open.value = false
  } catch {
    toast.add({
      title: 'Erro',
      description: 'Erro ao atualizar usuário',
      color: 'error'
    })
  }
}

defineExpose({ open })
</script>

<template>
  <UModal
    v-model:open="open"
    title="Editar usuário"
    description="Edite as informações do usuário"
  >
    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          label="Nome"
          name="name"
        >
          <UInput
            v-model="state.name"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Função"
          name="role"
        >
          <USelect
            v-model="state.role"
            :items="['user', 'admin']"
            class="w-full"
            :ui="{ value: 'capitalize', item: 'capitalize' }"
          />
        </UFormField>

        <div class="flex justify-end gap-2">
          <UButton
            label="Cancelar"
            color="neutral"
            variant="subtle"
            @click="open = false"
          />
          <UButton
            label="Salvar"
            color="primary"
            variant="solid"
            type="submit"
            :loading="loading"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
