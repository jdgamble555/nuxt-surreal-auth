import { surrealLogout } from "../utils/surreal"

export default defineEventHandler((event) => {
    surrealLogout(event)
    sendRedirect(event, "/")
})