<script setup lang="ts">
const props = defineProps<{
  userId?: string
}>()

const open = ref(false)

const { deleteUser, loading } = useUsers()
const toast = useToast()

async function onSubmit() {
  if (!props.userId) return

  try {
    await deleteUser(props.userId)
    toast.add({
      title: 'Sucesso',
      description: 'Usuário excluído com sucesso',
      color: 'success'
    })
    open.value = false
  } catch {
    toast.add({
      title: 'Erro',
      description: 'Erro ao excluir usuário',
      color: 'error'
    })
  }
}

defineExpose({ open })
</script>

<template>
  <UModal
    v-model:open="open"
    title="Excluir usuário"
    :description="`Deseja excluir o usuário ${props.userId}? Esta ação não pode ser desfeita.`"
  >
    <template #body>
      <div class="flex justify-end gap-2">
        <UButton
          label="Cancelar"
          color="neutral"
          variant="subtle"
          @click="open = false"
        />

        <UButton
          label="Excluir"
          color="error"
          variant="solid"
          :loading="loading"
          @click="onSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
