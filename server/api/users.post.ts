import { serverSupabaseServiceRole } from '#supabase/server'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['user', 'admin']).default('user')
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

  const { email, password, name, role } = parseResult.data

  const client = await serverSupabaseServiceRole<any>(event)

  const { data: user, error: createErrorResult } =
    await client.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name
      }
    })

  if (createErrorResult) {
    throw createError({
      statusCode: 500,
      statusMessage: createErrorResult.message
    })
  }

  if (user.user) {
    const { error: updateError } = await client
      .from('profiles')
      .upsert({
        user_id: user.user.id,
        name,
        role,
        email
      }, { onConflict: 'user_id' })
      .select()

    if (updateError) {
      console.error('Failed to update profile:', updateError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create profile record: ' + updateError.message
      })
    }
  }

  return { success: true }
})
