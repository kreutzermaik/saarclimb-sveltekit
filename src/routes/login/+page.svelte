<svelte:head>
  <title>SaarClimb - Login</title>
  <meta name="description" content="Login" />
</svelte:head>

<script lang="ts">
  import Auth from "$lib/features/Auth.svelte";
</script>

<main class="text-center mx-auto text-gray-700 p-4">
  <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
    Login
  </h1>
  <Auth type="login" />
</main>
