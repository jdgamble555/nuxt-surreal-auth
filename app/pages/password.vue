<script setup lang="ts">
definePageMeta({
  middleware: "auth-guard",
})
</script>

<template>
  <section>
    <h1 class="text-2xl font-bold">Change Password</h1>

    <form
      class="mt-10 flex flex-col items-center justify-center space-y-6"
      action="/api/password"
      method="POST"
    >
      <input
        class="rounded-lg border p-3"
        placeholder="Current Password"
        name="current_password"
        type="password"
        readonly
        onfocus="this.removeAttribute('readonly')"
      />
      <input
        class="rounded-lg border p-3"
        placeholder="New Password"
        name="new_password"
        type="password"
        readonly
        onfocus="this.removeAttribute('readonly')"
      />
      <button class="rounded-lg border bg-blue-500 p-3 text-white">
        Change Password
      </button>
    </form>
  </section>
</template>
