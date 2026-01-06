<script setup lang="ts">
import * as z from 'zod'
import type { FormError } from '@nuxt/ui'

const passwordSchema = z.object({
  current: z.string().min(6, 'Deve ter pelo menos 6 caracteres'),
  new: z.string().min(6, 'Deve ter pelo menos 6 caracteres')
})

type PasswordSchema = z.output<typeof passwordSchema>

const password = reactive<Partial<PasswordSchema>>({
  current: undefined,
  new: undefined
})

const validate = (state: Partial<PasswordSchema>): FormError[] => {
  const errors: FormError[] = []
  if (state.current && state.new && state.current === state.new) {
    errors.push({ name: 'new', message: 'Senhas devem ser diferentes' })
  }
  return errors
}
</script>

<template>
  <UPageCard
    title="Senha"
    description="Confirme sua senha atual antes de definir uma nova."
    variant="subtle"
  >
    <UForm
      :schema="passwordSchema"
      :state="password"
      :validate="validate"
      class="flex flex-col gap-4 max-w-xs"
    >
      <UFormField name="current">
        <UInput
          v-model="password.current"
          type="password"
          placeholder="Senha atual"
          class="w-full"
        />
      </UFormField>

      <UFormField name="new">
        <UInput
          v-model="password.new"
          type="password"
          placeholder="Nova senha"
          class="w-full"
        />
      </UFormField>

      <UButton label="Atualizar" class="w-fit cursor-pointer" type="submit" />
    </UForm>
  </UPageCard>

  <UPageCard
    title="Conta"
    description="Não deseja mais usar nosso serviço? Você pode excluir sua conta aqui. Esta ação não é reversível. Todas as informações relacionadas a esta conta serão excluídas permanentemente."
    class="bg-gradient-to-tl from-error/10 from-5% to-default"
  >
    <template #footer>
      <UButton label="Excluir conta" color="error" class="cursor-pointer" />
    </template>
  </UPageCard>
</template>
