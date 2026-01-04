export function useAnuncios() {
  const supabase = useSupabaseClient()
  const uploading = ref(false)
  const videos = ref<string[]>([])

  const BUCKET = 'anuncios'
  const FOLDER = 'videos'

  async function uploadVideo(file: File) {
    uploading.value = true

    const fileName = crypto.randomUUID() + '.' + file.name.split('.').pop()
    const path = `${FOLDER}/${fileName}`

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })

    uploading.value = false

    if (error) {
      console.error(error)
      throw error
    }
  }

  async function loadVideos() {
    videos.value = []

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list(FOLDER, {
        limit: 200,
        sortBy: { column: 'name', order: 'asc' }
      })

    if (error) {
      console.error(error)
      return
    }

    for (const file of data) {
      const path = `${FOLDER}/${file.name}`

      const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(path)

      videos.value.push(urlData.publicUrl)
    }
  }

  return {
    uploading,
    videos,
    uploadVideo,
    loadVideos
  }
}
