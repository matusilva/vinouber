import { serverSupabaseServiceRole } from '#supabase/server'
import { z } from 'zod'

const schema = z.object({
  id: z.string(),
  name: z.string().min(2).optional(),
  role: z.enum(['user', 'admin']).optional()
})

export default defineEventHandler(async (event) => {
  const parseResult = await readValidatedBody(event, (body) =>
    schema.safeParse(body)
  )

  if (!parseResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Error',
      data: parseResult.error.issues
    })
  }

  const { id, name, role } = parseResult.data

  const client = await serverSupabaseServiceRole<any>(event)

  const updates: Record<string, any> = {}
  if (name !== undefined) updates.name = name
  if (role !== undefined) updates.role = role

  if (Object.keys(updates).length > 0) {
    const { error: profileError } = await client
      .from('profiles')
      .update(updates)
      .eq('user_id', id)

    if (profileError) {
      throw createError({
        statusCode: 500,
        statusMessage: profileError.message
      })
    }
  }

  if (name) {
    const { error: authError } = await client.auth.admin.updateUserById(id, {
      user_metadata: { name }
    })

    if (authError) {
      console.error('Failed to update auth metadata:', authError)
    }
  }

  return { success: true }
})
