<svelte:head>
    <title>SaarClimb - Profil</title>
    <meta name="description" content="Profil"/>
</svelte:head>

<script lang="ts">
    import Header from "$lib/features/Header.svelte";
    import LoadingSpinner from "$lib/ui/LoadingSpinner.svelte";
    import Session from "../../session";
    import NotLoggedIn from "$lib/ui/NotLoggedIn.svelte";
    import type {User} from "../../types/User";
    import {onMount} from "svelte";
    import {getSummedPoints, userImage, userPoints, isLoggedIn} from "../../store";
    import ChartVisitedGyms from "$lib/features/ChartVisitedGyms.svelte";
    import SupabaseService from "../../api/supabase-service";

    let user: User;
    let finishedEvents: number;

    /**
     * get number of finished events per user
     */
    async function fetchEventsCount() {
        let events = (await SupabaseService.getEvents()).events;
        if (events) finishedEvents = events.length;
    }

    onMount(async () => {
        user = await Session.getCurrentUser();
        if (await $userPoints === 0) userPoints.set(getSummedPoints());
        await fetchEventsCount();
    });

</script>

<main class="text-center mx-auto text-gray-700 mb-20">
    <Header headerText="Profil"/>

    {#if $isLoggedIn}
        {#if user}
            <div
                    class="userImage mx-auto w-20 h-20 mt-4"
                    style={`background-image: url(${$userImage})`}
            />
            <br/>

            <div class="card card-compact shadow-xl mx-auto max-w-sm opacity-90 gradient-lightblue text-white">
                <div class="card-body">
                    <h2 class="card-title mx-auto">Persönliche Daten</h2>
                    <p class="py-1">Name: {user.name}</p>
                    <p class="py-1">Email: {user.email}</p>
                </div>
            </div>

            <br/>

            <div class="card card-compact shadow-xl mx-auto max-w-sm gradient-orange text-white">
                <div class="card-body">
                    {#await $userPoints}
                        <LoadingSpinner/>
                    {:then points}
                        {#if points >= 0}
                            <h2 class="card-title mx-auto">{points}</h2>
                        {:else}
                            <LoadingSpinner/>
                        {/if}
                        <p class="py-1">Punkte gesamt</p>
                    {/await}
                </div>
            </div>

            <br>

            <div class="card card-compact shadow-xl mx-auto max-w-sm gradient-purple text-white">
                <div class="card-body">
                    {#if finishedEvents}
                        <h2 class="card-title mx-auto">{finishedEvents}</h2>
                    {:else}
                        <LoadingSpinner/>
                    {/if}
                    <p class="py-1">Absolvierte Trainingseinheiten</p>
                </div>
            </div>

            <br>

            <div class="card card-compact shadow-xl mx-auto max-w-sm gradient-green text-white">
                <h2 class="card-title mx-auto py-4">Besuchte Hallen</h2>
                <ChartVisitedGyms/>
            </div>

        {:else}
            <LoadingSpinner/>
        {/if}
    {:else}
        <NotLoggedIn/>
    {/if}

</main>
