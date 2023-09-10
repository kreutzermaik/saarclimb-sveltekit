<script lang="ts">
  import Planer from "$lib/features/Planer.svelte";
  import Header from "../../lib/features/Header.svelte";
  import NotLoggedIn from "$lib/ui/NotLoggedIn.svelte";
  import {isLoggedIn} from "../../store";
</script>

<svelte:head>
  <title>Plan</title>
  <meta name="description" content="Plan" />
</svelte:head>

<Header headerText="Wochenplaner" />

{#if $isLoggedIn}
  <div class="card card-compact shadow-xl bg-white">
    <div class="card-body">
      <Planer />
    </div>
  </div>
{:else}
  <NotLoggedIn />
{/if}