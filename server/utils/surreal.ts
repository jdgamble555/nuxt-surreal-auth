import type { H3Event } from "h3"
import { RecordId, Surreal } from "surrealdb"


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
        if (error instanceof Error) {
            console.error(error)
            return {
                error,
                data: null
            }
        }
        return {
            error: new Error('Unknown connection error'),
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
        if (dbError instanceof Error) {
            console.error(dbError)
            return {
                error: dbError,
                data: null
            }
        }
        return {
            error: new Error('Unknown login error'),
            data: null
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
            data: token,
            error: null
        }

    } catch (signInError) {

        surrealLogout(event)

        if (signInError instanceof Error) {
            console.error(signInError)
            return {
                error: signInError,
                data: null
            }
        }
        return {
            error: new Error('Unknown sign-in error'),
            data: null
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
            data: token,
            error: null
        }

    } catch (signUpError) {

        surrealLogout(event)

        if (signUpError instanceof Error) {
            console.error(signUpError)
            return {
                error: signUpError,
                data: null
            }
        }
        return {
            error: new Error('Unknown sign-up error'),
            data: null
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

export async function surrealChangePassword(
    event: H3Event,
    currentPassword: string,
    newPassword: string
) {

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

        const { data: userId } = await getCurrentUserId(event)

        if (!userId) {
            return {
                data: null,
                error: null
            }
        }

        const query = `
            UPDATE $id
            SET password = crypto::argon2::generate($new)
            WHERE crypto::argon2::compare(password, $old)
        `

        const [result] = await db.query(query, {
            id: new RecordId('users', userId),
            old: currentPassword,
            new: newPassword
        }).collect<[{ id: string, password: string, username: string }][]>()

        if (!result) {
            return {
                data: null,
                error: new Error("Password change failed")
            }
        }
        return {
            data: result[0],
            error: null
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error)
            return {
                error,
                data: null
            }
        }
        return {
            error: new Error('Unknown query error'),
            data: null
        }
    }

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
            if (error instanceof Error) {
                console.error(error)
                return {
                    error,
                    data: null
                }
            }
            return {
                error: new Error('Unknown authentication error'),
                data: null
            }
        }
    }

    const userId = parseToken(token)

    return {
        data: userId,
        error: null
    }
}

export function parseToken(token: string) {
    return JSON.parse(atob(token.split('.')[1])).ID.split(':')[1] as string
}