import { getCurrentUserId } from "../utils/surreal"

export default defineEventHandler(async (event) => {
    const { data: userId } = await getCurrentUserId()
    event.context.auth = { userId }
})