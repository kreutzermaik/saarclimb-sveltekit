<script lang="ts">
    import {gyms} from "../../store.ts";
    import Button from "$lib/ui/Button.svelte";
    import type {Event} from "../../types/Event";
    import SupabaseService from "../../api/supabase-service";
    import Toast from "$lib/ui/Toast";

    export let newEvent: Event;
    $: location = "";

    function setLocation(e: any) {
        location = e.target.value;
    }

    /**
     * hide dialog
     */
    function closeDialog() {
        document.getElementById("ask-location-dialog")?.classList.add("hidden");
    }

    /**
     * add new event to supabase and close dialog
     */
    async function addEvent() {
        try {
            newEvent.location = location;
            await SupabaseService.addEvent(newEvent);
            closeDialog();
            new Toast().push({content: Toast.EVENT_ADDED_MESSAGE, style: 'success', duration: 3000});
        } catch (err: any) {
            new Toast().push({content: Toast.EVENT_ADDED_ERROR_MESSAGE, style: 'error', duration: 5000});
        }
    }

</script>

<div id="ask-location-dialog" class="relative z-10 hidden" aria-labelledby="modal-title" role="dialog"
     aria-modal="true">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>

    <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Ort der
                                Trainingseinheit</h3>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500 text-left">
                                    Falls du in einer Boulder- oder Kletterhalle warst, kannst du den Ort dafür
                                    hinzufügen.
                                    Der Besuch wird dann für deine Statistiken ausgewertet. Du kannst aber auch einfach
                                    auf <b>Speichern</b> klicken.
                                </p>
                                <div class="m-2 w-full">
                                    <div class="m-2">
                                        <label for="gyms"
                                               class="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white">Ort</label>
                                        <select id="gyms"
                                                on:change={e => setLocation(e)}
                                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                            <option selected>Bitte auswählen...</option>
                                            {#if $gyms}
                                                {#each $gyms as gym}
                                                    <option value={gym.name}>{gym.name}</option>
                                                {/each}
                                            {/if}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <Button
                            text="Speichern"
                            type="secondary"
                            rounded="true"
                            width="w-full"
                            onClick={addEvent}
                    />
                    <Button
                            text="Abbrechen"
                            type="white"
                            outline="true"
                            rounded="true"
                            width="w-full"
                            onClick={closeDialog}
                            textColor="text-gray-700"
                    />
                </div>
            </div>
        </div>
    </div>
</div>