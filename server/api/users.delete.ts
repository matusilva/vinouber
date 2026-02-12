import { serverSupabaseServiceRole } from '#supabase/server'
import { z } from 'zod'

const schema = z.object({
  id: z.string()
})

export default defineEventHandler(async (event) => {
  const query = await getQuery(event)
  const parseResult = schema.safeParse(query)

  if (!parseResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Error',
      data: parseResult.error.issues
    })
  }

  const { id } = parseResult.data

  const client = await serverSupabaseServiceRole(event)

  const { error } = await client.auth.admin.deleteUser(id)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return { success: true }
})
