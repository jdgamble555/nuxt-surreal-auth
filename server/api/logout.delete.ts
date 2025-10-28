import { surrealLogout } from "../utils/surreal";

export default defineEventHandler(() => {
    surrealLogout();
    return { success: true, message: 'Logged out' };
});