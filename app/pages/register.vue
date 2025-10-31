<template>
  <section>
    <h1 class="text-2xl font-bold">Register</h1>

    <form
      class="mt-10 flex flex-col items-center justify-center space-y-6"
      action="/api/register"
      method="POST"
    >
      <input
        class="rounded-lg border p-3"
        placeholder="Username"
        name="username"
        type="text"
        autocomplete="off"
      />
      <input
        class="rounded-lg border p-3"
        placeholder="Password"
        name="password"
        type="password"
        autocomplete="off"
      />
      <button class="rounded-lg border bg-blue-500 p-3 text-white">
        Register
      </button>
    </form>
    <hr class="my-5" />
    <p class="text-center text-gray-600">
      <NuxtLink to="/login" class="text-blue-500 underline">
        Already registered?
      </NuxtLink>
    </p>
    <hr class="my-5" />
  </section>
</template>
