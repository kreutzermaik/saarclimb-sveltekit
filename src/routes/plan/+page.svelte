<script lang="ts">
  import Planer from "$lib/features/Planer.svelte";
  import Header from "../../lib/features/Header.svelte";
  import Session from "../../session";
  import NotLoggedIn from "$lib/ui/NotLoggedIn.svelte";

  let isLoggedIn: boolean = false;

  /**
   * initialize isLoggedIn variable
   */
   async function initLoggedIn() {
    try {
      isLoggedIn = await Session.isLoggedIn();
    } catch (err: any) {
      console.log(err);
    }
  }

  initLoggedIn();
</script>

<svelte:head>
  <title>Plan</title>
  <meta name="description" content="Plan" />
</svelte:head>

<Header headerText="Wochenplaner" />

{#if isLoggedIn}
  <div class="card card-compact shadow-xl bg-white">
    <div class="card-body">
      <Planer />
    </div>
  </div>
{:else}
  <NotLoggedIn />
{/if}