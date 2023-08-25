<script lang="ts">
    import Header from "$lib/features/Header.svelte";
    import SupabaseService from "../../api/supabase-service";
    import LoadingSpinner from "$lib/ui/LoadingSpinner.svelte";
    import Cache from "../../cache";
    import Session from "../../session";
    import DataProvider from "../../data-provider";
    import Button from "$lib/ui/Button.svelte";
    import NotLoggedIn from "$lib/ui/NotLoggedIn.svelte";
    import type {User} from "../../types/User";
    import {onMount} from "svelte";

    let user: User;
    let userPoints: number;
    let avatar: any;
    let loggedIn: boolean = false;

    /**
     * sum up all points of current user
     * @returns
     */
    async function getSummedPoints(): Promise<number> {
        let summedPoints: number = 0;
        const pointsArray = (await SupabaseService.getCurrentPoints())?.points?.points;
        if (pointsArray !== null) {
            pointsArray.map((item: any) => {
                summedPoints += item.value;
            });
        } else {
            summedPoints = 0;
        }
        return summedPoints;
    }

    /**
     * update avatar
     * @param e
     */
    async function handleUpload(e: any) {
        let file;

        if (e.target.files) {
            file = e.target.files[0];
        }

        Cache.removeCacheItem("userImage");
        await SupabaseService.updateAvatar(file);
        await DataProvider.updateAvatarUrlInCache();
        avatar = JSON.parse(Cache.getCacheItem("userImage"));
        closeDialog();
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

    onMount(async () => {
        if (await Session.isLoggedIn()) {
            loggedIn = true;
        }
        user = await Session.getCurrentUser();
        avatar = JSON.parse(Cache.getCacheItem("userImage"));
        userPoints = await getSummedPoints();
    });


</script>

<main class="text-center mx-auto text-gray-700">
    <Header headerText="Profil"/>

    {#if loggedIn}
        {#if user}
            <div
                    class="userImage mx-auto w-20 h-20 mt-4 cursor-pointer border-secondary border-2 hover:opacity-80"
                    style={`background-image: url(${avatar})`}
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

            <div class="card card-compact shadow-xl mx-auto max-w-sm bg-secondary opacity-90 text-white">
                <div class="card-body">
                    <h2 class="card-title mx-auto">Persönliche Daten</h2>
                    <p class="py-1">Name: {user.name}</p>
                    <p class="py-1">Email: {user.email}</p>
                </div>
            </div>

            <br/>

            <div class="card card-compact shadow-xl mx-auto max-w-sm bg-custom-green text-white">
                <div class="card-body">
                    {#if userPoints >= 0}
                        <h2 class="card-title mx-auto">{userPoints}</h2>
                    {:else}
                        <LoadingSpinner/>
                    {/if}
                    <p class="py-1">Punkte gesamt</p>
                </div>
            </div>
        {:else}
            <LoadingSpinner/>
        {/if}
    {:else}
        <NotLoggedIn />
    {/if}

</main>
