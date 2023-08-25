<script lang="ts">
  import Calendar from "$lib/features/Calendar.svelte";
  import PlanerCompact from "$lib/features/PlanerCompact.svelte";
  import NotLoggedIn from "$lib/ui/NotLoggedIn.svelte";
  import SupabaseService from "../api/supabase-service";
  import Header from "../lib/features/Header.svelte";
  import Session from "../session";
  import DataProvider from "../data-provider";
  import {onMount} from "svelte";

  let isLoggedIn: boolean = false;

  async function fetchAllUsers() {
    try {
      let result = (await SupabaseService.getAllUsers()).users;
      console.log(result);
      return result;
    } catch (err: any) {
      console.log(err);
    }
  }

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

  onMount(async () => {
    await initLoggedIn();
    await DataProvider.initUserData();
  })
</script>

<div>
  <Header headerText="Dashboard" />
  {#if isLoggedIn}
    <PlanerCompact />
    <br>
    <div class="card card-compact shadow-xl bg-white">
      <div class="card-body">
        <Calendar />
      </div>
    </div>
  {:else}
    <NotLoggedIn />
  {/if}
</div>
