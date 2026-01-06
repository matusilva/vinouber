<script setup lang="ts">
const props = defineProps<{
  userId?: string
}>()

const open = ref(false)

async function onSubmit() {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  open.value = false
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
          loading-auto
          @click="onSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
