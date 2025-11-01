import { parseToken, surrealRegister } from "../utils/surreal"

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
        data: token,
        error: registerError
    } = await surrealRegister(event, username, password)

    if (registerError) {
        throw createError({
            statusCode: 500,
            message: 'Registration failed',
            data: registerError.message
        })
    }

    if (!token) {
        throw createError({
            statusCode: 401,
            message: 'Invalid credentials',
            data: token
        })
    }

    const userId = parseToken(token)

    if (!userId) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
            data: userId
        })
    }

    sendRedirect(event, '/')
})