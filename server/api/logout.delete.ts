import { surrealLogout } from "../utils/surreal"

export default defineEventHandler((event) => {
    surrealLogout(event)
    return { success: true, message: 'Logged out' }
})