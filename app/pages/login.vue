<script setup lang="ts">
definePageMeta({
  middleware: "guest-guard"
})
</script>

<template>
  <section>
    <h1 class="text-2xl font-bold">Login</h1>

    <form
      class="mt-10 flex flex-col items-center justify-center space-y-6"
      action="/api/login"
      method="POST"
      autocomplete="off"
    >
      <input
        class="rounded-lg border p-3"
        placeholder="Username"
        name="username"
        type="text"
        readonly
        onfocus="this.removeAttribute('readonly')"
      />
      <input
        class="rounded-lg border p-3"
        placeholder="Password"
        name="password"
        type="password"
        readonly
        onfocus="this.removeAttribute('readonly')"
      />
      <button class="rounded-lg border bg-blue-500 p-3 text-white">
        Login
      </button>
    </form>
    <hr class="my-5" />
    <p class="text-center text-gray-600">
      <NuxtLink to="/register" class="text-blue-500 underline">
        New User?
      </NuxtLink>
    </p>
    <hr class="my-5" />
  </section>
</template>
