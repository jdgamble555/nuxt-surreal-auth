import { getCurrentUserId, surrealRegister } from "../utils/surreal"

export default defineEventHandler(async (event) => {

    const body = await readBody<{
        username: string
        password: string
    }>(event)

    const { username, password } = body

    if (!username || !password) {
        throw createError({
            statusCode: 400,
            message: 'Missing credentials'
        })
    }

    const {
        data: db,
        error: registerError
    } = await surrealRegister(username, password)

    if (registerError) {
        throw createError({
            statusCode: 500,
            message: 'Registration failed'
        })
    }

    if (!db) {
        throw createError({
            statusCode: 401,
            message: 'Invalid credentials'
        })
    }

    const user = getCurrentUserId()
    if (!user) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }

    return { success: true, user }
})