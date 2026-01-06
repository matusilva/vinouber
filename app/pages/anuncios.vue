<script setup lang="ts">
definePageMeta({
  layout: false
})

const { loadVideos, videos } = useAnuncios()

const current = ref(0)
const player = ref<HTMLVideoElement | null>(null)

function playCurrent() {
  if (!player.value || videos.value.length === 0) return
  player.value.src = videos.value[current.value]!
  player.value.controls = false
  player.value.loop = false
  player.value.muted = true
  player.value.play().catch(() => {})
}

function nextVideo() {
  current.value = (current.value + 1) % videos.value.length
  playCurrent()
}

onMounted(async () => {
  await loadVideos()
  playCurrent()

  player.value?.addEventListener('pause', () => {
    player.value?.play()
  })

  player.value?.addEventListener('ended', nextVideo)
})
</script>

<template>
  <video
    ref="player"
    autoplay
    playsinline
    disablepictureinpicture
    controlslist="nodownload noplaybackrate noremoteplayback"
  />
</template>
