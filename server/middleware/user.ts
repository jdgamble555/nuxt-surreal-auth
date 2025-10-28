import { getCurrentUserId } from "../utils/surreal"

export default defineEventHandler((event) => {
    const userId = getCurrentUserId()
    event.context.auth = { userId }
})