<script lang="ts"></script>

<template>
  <section>
    <h1 class="text-2xl font-bold">Login</h1>

    <form class="mt-10 flex flex-col items-center justify-center space-y-6">
      <input class="rounded-lg border p-3" placeholder="Username" />
      <input class="rounded-lg border p-3" placeholder="Password" />
      <button class="rounded-lg border bg-blue-500 p-3 text-white">
        Login
      </button>
    </form>
    <hr class="my-5" />
    <p class="text-center text-gray-600">
      <a href="/register" class="text-blue-500 underline">New User?</a>
    </p>
    <hr class="my-5" />
  </section>
</template>
