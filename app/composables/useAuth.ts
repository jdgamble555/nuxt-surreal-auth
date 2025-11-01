export async function useAuth() {

    const { data, error } = await useFetch<{ userId: string | null }>("/api/user", {
        server: true,
        default: () => ({ userId: null }),
        lazy: false
    })

    if (error.value) {
        console.error(error.value)
    }

    const userId = computed(() => data.value?.userId || null)

    return { userId }
}