import type { H3Event } from "h3"
import { Surreal } from "surrealdb"


const SURREAL_COOKIE_NAME = 'token'

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 30 // 30 minutes
} as Parameters<typeof setCookie>[3]


export async function createSurrealServer(event: H3Event) {

    const config = useRuntimeConfig()

    const db = new Surreal()

    try {
        await db.connect(config.surrealUrl, {
            namespace: config.surrealNamespace,
            database: config.surrealDatabase
        })
    } catch (error) {
        console.error(error)
        return {
            error,
            data: null
        }
    }

    const surrealToken = getCookie(
        event,
        SURREAL_COOKIE_NAME
    )

    if (surrealToken) {
        await db.authenticate(surrealToken)
    }

    return {
        data: db,
        error: null
    }
}

export async function surrealLogin(event: H3Event, username: string, password: string) {

    const config = useRuntimeConfig()

    const { data: db, error: dbError } = await createSurrealServer(event)

    if (dbError) {
        return {
            data: null,
            error: dbError
        }
    }

    if (!db) {
        return {
            data: null,
            error: new Error("No SurrealDB instance")
        }
    }

    try {
        const auth = await db.signin({
            namespace: config.namespace,
            database: config.database,
            variables: {
                username,
                password
            },
            access: 'user'
        })

        const { token } = auth

        setCookie(
            event,
            SURREAL_COOKIE_NAME,
            token,
            COOKIE_OPTIONS
        )

        return {
            data: db,
            error: null
        }

    } catch (signInError) {

        surrealLogout(event)

        console.error('Sign-in error:', signInError)
        return {
            data: null,
            error: signInError
        }
    }
}


export async function surrealRegister(event: H3Event, username: string, password: string) {

    const config = useRuntimeConfig()

    const { data: db, error: dbError } = await createSurrealServer(event)

    if (dbError) {
        return {
            data: null,
            error: dbError
        }
    }

    if (!db) {
        return {
            data: null,
            error: new Error("No SurrealDB instance")
        }
    }

    try {
        const auth = await db.signup({
            namespace: config.namespace,
            database: config.database,
            variables: {
                username,
                password
            },
            access: 'user'
        })

        const { token } = auth

        setCookie(
            event,
            SURREAL_COOKIE_NAME,
            token,
            COOKIE_OPTIONS
        )

        return {
            data: db,
            error: null
        }

    } catch (signUpError) {

        surrealLogout(event)

        console.error('Sign-up error:', signUpError)
        return {
            data: null,
            error: signUpError
        }
    }
}

export function surrealLogout(event: H3Event) {

    deleteCookie(
        event,
        SURREAL_COOKIE_NAME,
        COOKIE_OPTIONS
    )
}

export async function getCurrentUserId(event: H3Event, refetch = false) {

    const token = getCookie(event, SURREAL_COOKIE_NAME)

    if (!token) {
        return {
            data: null,
            error: null
        }
    }

    if (refetch) {

        const {
            data: db,
            error: dbError
        } = await createSurrealServer(event)

        if (dbError) {
            return {
                data: null,
                error: dbError
            }
        }

        if (!db) {
            return {
                data: null,
                error: new Error("No SurrealDB instance")
            }
        }

        try {
            const userId = (await db.auth())?.id.id.toString()

            if (!userId) {
                return {
                    data: null,
                    error: null
                }
            }
            return {
                data: userId,
                error: null
            }

        } catch (error) {
            console.error('Error fetching user ID:', error)
            return {
                data: null,
                error: error as Error
            }
        }
    }

    const userId = JSON.parse(atob(token.split('.')[1])).ID.split(':')[1] as string

    return {
        data: userId,
        error: null
    }
}