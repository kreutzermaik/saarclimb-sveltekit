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
    import {getSummedPoints, isLoggedIn, userImage, userPoints} from "../../store";
    import ChartVisitedGyms from "$lib/features/ChartVisitedGyms.svelte";
    import SupabaseService from "../../api/supabase-service";
    import NumberAnimation from "$lib/ui/NumberAnimation.svelte";
    import Button from "$lib/ui/Button.svelte";
    import imageCompression from "browser-image-compression";
    import DataProvider from "../../data-provider";

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

    /**
     * update avatar
     * @param e
     */
    async function handleUpload(e: any) {
        closeDialog();

        let file: File = e.target.files[0];

        try {
            const compressedFile = await imageCompression(file, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            });
            await SupabaseService.updateAvatar(compressedFile);
            await DataProvider.updateAvatarUrlInCache();
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * open dialog for changing profile picture
     */
    function openDialog() {
        document.getElementById("image-upload-dialog")?.classList.remove("hidden");
    }

    /**
     * hide dialog
     */
    function closeDialog() {
        document.getElementById("image-upload-dialog")?.classList.add("hidden");
    }

</script>

<main class="text-center mx-auto text-gray-700 mb-20">
    <Header headerText="Profil"/>

    {#if $isLoggedIn}
        {#if user}
            <div
                    class="userImage mx-auto w-20 h-20 mt-4"
                    style={`background-image: url(${$userImage})`}
                    on:click={openDialog}
            />

            <div
                    id="image-upload-dialog"
                    class="relative z-10 hidden"
                    aria-labelledby="modal-title"
                    role="dialog"
                    aria-modal="true"
            >
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
                <div class="fixed inset-0 z-10 overflow-y-auto">
                    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div class="sm:flex sm:items-start">
                                    <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                        <h3
                                                class="text-base font-semibold leading-6 text-gray-900"
                                                id="modal-title"
                                        >
                                            <p class="text-left">Profilbild ändern</p>
                                        </h3>
                                        <br/>
                                        <div class="m-2 w-full">
                                            <input
                                                    type="file"
                                                    accept="image/*"
                                                    id="file-input"
                                                    on:change={e => handleUpload(e)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <Button
                                        text="Abbrechen"
                                        type="secondary"
                                        onClick={closeDialog}
                                        outline="true"
                                        rounded="true"
                                        width="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                            <h2 class="card-title mx-auto">
                                <NumberAnimation targetValue={points}/>
                            </h2>
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
                        <h2 class="card-title mx-auto">
                            <NumberAnimation targetValue={finishedEvents}/>
                        </h2>
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
