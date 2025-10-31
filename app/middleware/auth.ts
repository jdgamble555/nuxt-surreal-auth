export default defineNuxtRouteMiddleware(async () => {
  const { userId } = useAuth()
  if (!userId.value) {
    return navigateTo('/login', { redirectCode: 302 })
  }
})