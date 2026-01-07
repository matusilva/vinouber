<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

definePageMeta({
  layout: false
})

const toast = useToast()
const { login } = useAuth()

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Digite seu email',
    required: true
  },
  {
    name: 'password',
    label: 'Senha',
    type: 'password',
    placeholder: 'Digite sua senha',
    required: true
  },
  {
    name: 'remember',
    label: 'Lembrar-me',
    type: 'checkbox'
  }
]

// const providers = [{
//   label: 'Google',
//   icon: 'i-simple-icons-google',
//   onClick: () => {
//     toast.add({ title: 'Google', description: 'Login with Google' })
//   }
// }, {
//   label: 'GitHub',
//   icon: 'i-simple-icons-github',
//   onClick: () => {
//     toast.add({ title: 'GitHub', description: 'Login with GitHub' })
//   }
// }]

const schema = z.object({
  email: z.email('Email inválido'),
  password: z
    .string('Senha é obrigatória')
    .min(6, 'Deve ter pelo menos 6 caracteres')
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  const { email, password } = payload.data

  try {
    await login(email, password)
    await navigateTo('/')
  } catch (err: any) {
    toast.add({
      title: 'Falha no login',
      description: err?.message || 'Credenciais inválidas.',
      color: 'error',
      icon: 'i-lucide-x'
    })
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        title="Login"
        description="Insira suas credenciais para acessar sua conta."
        icon="i-lucide-user"
        :fields="fields"
        :loading-auto="true"
        @submit="onSubmit"
      />
    </UPageCard>
  </div>
</template>
