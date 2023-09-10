<svelte:head>
    <title>SaarClimb - Fortschritt</title>
    <meta name="description" content="Fortschritt" />
</svelte:head>

<script lang="ts">
    import Header from "../../lib/features/Header.svelte";
    import NotLoggedIn from "$lib/ui/NotLoggedIn.svelte";
    import ProgressCard from "$lib/features/ProgressCard.svelte";
    import {isLoggedIn} from "../../store";
</script>

<main class="text-center text-gray-700">
    <Header headerText="Fortschritt"/>

    {#if $isLoggedIn}
        <ProgressCard/>
    {:else}
        <NotLoggedIn/>
    {/if}
</main>