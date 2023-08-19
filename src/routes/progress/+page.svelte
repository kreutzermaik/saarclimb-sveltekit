<script lang="ts">
    import Header from "../../lib/features/Header.svelte";
    import NotLoggedIn from "$lib/ui/NotLoggedIn.svelte";
    import {onMount} from "svelte";
    import Session from "../../session.js";
    import ProgressCard from "$lib/features/ProgressCard.svelte";

    let loggedIn: boolean = false;

    onMount(async () => {
        if (await Session.isLoggedIn()) {
            loggedIn = true;
        }
    });
</script>

<main class="text-center text-gray-700">
    <Header headerText="Fortschritt"/>

    {#if loggedIn}
        <ProgressCard/>
    {:else}
        <NotLoggedIn/>
    {/if}
</main>