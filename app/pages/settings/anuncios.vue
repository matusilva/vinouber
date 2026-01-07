<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const { uploadVideo, loadVideos, videos } = useAnuncios()
const toast = useToast()

const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25MB
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm']

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  )
}

const schema = z.object({
  video: z
    .instanceof(File, {
      message: 'Selecione um arquivo de vídeo.'
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `O vídeo é muito grande. Escolha um arquivo menor que ${formatBytes(
        MAX_FILE_SIZE
      )}.`
    })
    .refine((file) => ACCEPTED_VIDEO_TYPES.includes(file.type), {
      message: 'Envie um vídeo válido (MP4 ou WebM).'
    })
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  video: undefined
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await uploadVideo(event.data.video)
    toast.add({
      title: 'Vídeo enviado',
      description: 'Seu vídeo foi enviado com sucesso',
      icon: 'i-lucide-check-circle',
      color: 'success'
    })
    state.video = undefined
    await loadVideos()
  } catch (err) {
    toast.add({
      title: 'Erro ao enviar vídeo',
      description: 'Ocorreu um erro ao enviar seu vídeo. Tente novamente.',
      icon: 'i-lucide-x-circle',
      color: 'error'
    })
    console.error(err)
  }
}

onMounted(loadVideos)
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-4 w-96"
    @submit="onSubmit"
  >
    <UFormField
      name="video"
      label="Vídeo"
      description="MP4 ou WEBM (máx. 25MB)"
    >
      <UFileUpload
        v-model="state.video"
        accept="video/mp4,video/webm"
        class="min-h-48"
      />
    </UFormField>

    <UButton
      type="submit"
      label="Enviar"
      loading-auto
      class="cursor-pointer"
    />
  </UForm>

  <hr class="my-8">

  <UCard>
    <template #header>
      <span class="font-semibold">Vídeos no Storage</span>
    </template>

    <div
      v-if="videos.length === 0"
      class="text-sm text-gray-500"
    >
      Nenhum vídeo encontrado.
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <video
        v-for="src in videos"
        :key="src"
        :src="src"
        controls
        class="rounded-lg border"
      />
    </div>
  </UCard>
</template>
