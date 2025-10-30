<script setup lang="ts">
const userId = useFetch<string | null>("/api/user").data;
</script>

<template>
  <main class="mt-10 flex flex-col items-center justify-center space-y-6">
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>  
    <nav class="flex space-x-6">
      <NuxtLink to="/">Home</NuxtLink>
      <template v-if="userId">
        <Logout />
      </template>
      <template v-else>
        <NuxtLink to="/login">Login</NuxtLink>
      </template>
      <NuxtLink to="/pages">Public Data</NuxtLink>
      <NuxtLink to="/todos">Todos</NuxtLink>
    </nav>
  </main>
</template>
