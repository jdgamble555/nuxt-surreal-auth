export default defineNuxtRouteMiddleware(async () => {
  const { userId } = await useAuth()
  if (userId.value) {
    return navigateTo('/dashboard', { redirectCode: 302 })
  }
})