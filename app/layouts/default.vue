<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const open = ref(false)

const links = [
  [
    {
      label: 'Dashboard',
      icon: 'i-lucide-house',
      to: '/',
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: 'Anúncios',
      icon: 'i-lucide-megaphone',
      to: '/anuncios',
      onSelect: () => {
        open.value = false
      }
    },
    {
      label: 'Configurações',
      to: '/settings',
      icon: 'i-lucide-settings',
      defaultOpen: true,
      type: 'trigger',
      children: [
        {
          label: 'Geral',
          to: '/settings',
          exact: true,
          onSelect: () => {
            open.value = false
          }
        },
        {
          label: 'Anúncios',
          to: '/settings/anuncios',
          onSelect: () => {
            open.value = false
          }
        },
        {
          label: 'Usuários',
          to: '/settings/users',
          onSelect: () => {
            open.value = false
          }
        },
        {
          label: 'Segurança',
          to: '/settings/security',
          onSelect: () => {
            open.value = false
          }
        }
      ]
    }
  ]
  // [{
  //   label: 'Feedback',
  //   icon: 'i-lucide-message-circle',
  //   to: 'https://github.com/nuxt-ui-templates/dashboard',
  //   target: '_blank'
  // }, {
  //   label: 'Help & Support',
  //   icon: 'i-lucide-info',
  //   to: 'https://github.com/nuxt-ui-templates/dashboard',
  //   target: '_blank'
  // }]
] satisfies NavigationMenuItem[][]

const groups = computed(() => [
  {
    id: 'links',
    label: 'Ir para',
    items: links.flat()
  },
  {
    id: 'code',
    label: 'Código fonte',
    items: [
      {
        id: 'source',
        label: 'Ver página no GitHub',
        icon: 'i-simple-icons-github',
        to: 'https://github.com/matusilva/vinouber',
        target: '_blank'
      }
    ]
  }
])
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <!-- <template #header="{ collapsed }">
        <TeamsMenu :collapsed="collapsed" />
      </template> -->

      <template #default="{ collapsed }">
        <UDashboardSearchButton
          :collapsed="collapsed"
          label="Pesquisar..."
          class="bg-transparent ring-default"
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          tooltip
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" placeholder="Clique para pesquisar ou digite..." />

    <slot />
  </UDashboardGroup>
</template>
