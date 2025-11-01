import { surrealChangePassword } from "../utils/surreal"

export default defineEventHandler(async (event) => {

    const body = await readBody<{
        current_password: string
        new_password: string
    }>(event)

    const { current_password, new_password } = body

    if (!current_password || !new_password) {
        throw createError({
            statusCode: 400,
            message: 'Missing credentials'
        })
    }

    const {
        data: newRecord,
        error: changePasswordError
    } = await surrealChangePassword(
        event,
        current_password,
        new_password
    )

    if (changePasswordError) {
        throw createError({
            statusCode: 500,
            message: 'Change password failed'
        })
    }

    if (!newRecord) {
        throw createError({
            statusCode: 401,
            message: 'Invalid credentials'
        })
    }

    sendRedirect(event, '/')
})