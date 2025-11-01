<script setup lang="ts">
const { userId } = await useAuth()
</script>

<template>
  <main class="mt-10 flex flex-col items-center justify-center space-y-6">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <nav class="flex space-x-6">
      <NuxtLink to="/">Home</NuxtLink>
      <template v-if="userId">
        <a href="/api/logout"> Logout </a>
      </template>
      <template v-else>
        <NuxtLink to="/login">Login</NuxtLink>
      </template>
      <NuxtLink to="/dashboard">Dashboard</NuxtLink>
    </nav>
  </main>
</template>
