<script setup lang="ts">
definePageMeta({
  middleware: ["auth-guard"]
})
const { userId } = await useAuth()
</script>

<template>
  <section class="space-y-6">
    <h1 class="text-2xl font-bold">Dashboard</h1>
    <p>This will be your login wall dashboard!</p>
    <p>
      Your user ID is: <span class="font-mono font-bold">{{ userId }}</span>
    </p>
    <hr class="my-5" />
    <p class="text-center text-gray-600">
      <NuxtLink to="/password" class="text-blue-500 underline">
        Change Password
      </NuxtLink>
    </p>
    <hr class="my-5" />
  </section>
</template>
