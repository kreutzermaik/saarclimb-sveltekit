<svelte:head>
    <title>SaarClimb - Dashboard</title>
    <meta name="description" content="Dashboard"/>
</svelte:head>

<script lang="ts">
    import Calendar from "$lib/features/Calendar.svelte";
    import PlanerCompact from "$lib/features/PlanerCompact.svelte";
    import NotLoggedIn from "$lib/ui/NotLoggedIn.svelte";
    import Header from "../lib/features/Header.svelte";
    import DataProvider from "../data-provider";
    import {onMount} from "svelte";
    import {isLoggedIn} from "../store";
    import {dev} from '$app/environment'
    import {autoLogin} from "../test/autoLogin";

    onMount(async () => {
        if ($isLoggedIn) {
            await DataProvider.initUserData();
        } else if (!$isLoggedIn && dev) {
            await autoLogin();
        }
    })
</script>

<div>
    <Header headerText="Dashboard"/>
    {#if $isLoggedIn}
        <PlanerCompact/>
        <br>
        <div class="card card-compact shadow-xl bg-white">
            <div class="card-body">
                <Calendar/>
            </div>
        </div>
    {:else}
        <NotLoggedIn/>
    {/if}
</div>
