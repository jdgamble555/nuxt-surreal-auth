export default defineNuxtRouteMiddleware(async () => {
  const { userId } = await useAuth()
  if (!userId.value) {
    return navigateTo('/login', { redirectCode: 302 })
  }
})

