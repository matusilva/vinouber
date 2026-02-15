<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const items = [
  [
    {
      label: 'Novo Usuário',
      icon: 'i-lucide-user-plus',
      to: '/settings/users'
    }
  ]
] satisfies DropdownMenuItem[][]
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar
        title="Dashboard"
        :ui="{ right: 'gap-3' }"
      >
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UDropdownMenu :items="items">
            <UButton
              icon="i-lucide-plus"
              size="md"
              class="rounded-full"
            />
          </UDropdownMenu>
        </template>
      </UDashboardNavbar>
    </template>

    <UDashboardPanelContent>
      <UPageBody>
        <div class="flex flex-col gap-4">
          <h2 class="text-lg font-semibold">Bem-vindo ao Painel</h2>
          <p class="text-gray-500">Selecione uma opção no menu lateral para começar.</p>
        </div>
      </UPageBody>
    </UDashboardPanelContent>
  </UDashboardPanel>
</template>
