<script lang="ts">
    import SupabaseService from "../../api/supabase-service";
    import Session from "../../session";
    import Notification from "../ui/Notification";
    import type {Event} from "../../types/Event";
    import Button from "$lib/ui/Button.svelte";
    import {gyms} from "../../store";

    export let propsDate: any;
    $: date = "";
    $: event = "";
    $: location = "";

    function setLocation(e: any) {
        location = e.target.value;
    }

    function setEvent(e: any) {
        event = e.target.value;
    }

    function setDate(e: any) {
        date = e.target.value;
    }

    /**
     * add new event to supabase and close dialog
     */
    async function addEvent() {
        try {
            if (!event) return;
            let newEvent: Event = {
                title: event,
                date: date !== "" ? date : propsDate,
                userid: await Session.getCurrentUserId(),
                location: location,
            };
            await SupabaseService.addEvent(newEvent);
            closeDialog();
            event = "";
            location = "";
            Notification.show(Notification.EVENT_ADDED_MESSAGE);
        } catch (err: any) {
            Notification.show(Notification.EVENT_ADDED_ERROR_MESSAGE, err.message, "error", 5000);
        }
    }

    /**
     * hide dialog
     */
    function closeDialog() {
        document.getElementById("event-dialog")?.classList.add("hidden");
    }
</script>

<div
        id="event-dialog"
        class="relative z-10 hidden"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
>
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>

    <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
                class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
            <div
                    class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            >
                <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <h3
                                    class="text-base font-semibold leading-6 text-gray-900"
                                    id="modal-title"
                            >
                                Training hinzufügen
                            </h3>
                            <div class="mt-2">
                                <p class="text-sm text-gray-500">
                                    Füge hier eine Trainingseinheit hinzu. Dazu musst du alle
                                    Felder ausfüllen und auf Speichern klicken. Die Einheit wird
                                    anschließend in der Kalenderübersicht angezeigt.
                                </p>
                                <div class="m-2 w-full">
                                    <div class="m-2">
                                        <label
                                                for="date"
                                                class="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white"
                                        >
                                            Datum
                                        </label>
                                        <input
                                                name="date"
                                                id="date"
                                                type="text"
                                                on:change={e => setDate(e)}
                                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="2023-05-31"
                                                value={propsDate}
                                        />
                                    </div>
                                    <div class="m-2">
                                        <label
                                                for="event"
                                                class="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white"
                                        >
                                            Trainingseinheit
                                        </label>
                                        <input
                                                bind:value={event}
                                                name="event"
                                                id="event"
                                                type="text"
                                                on:change={e => setEvent(e)}
                                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                placeholder="z.B. Bouldern"
                                        />
                                    </div>
                                    <div class="m-2">
                                        <label
                                                for="gyms"
                                                class="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white"
                                        >
                                            Ort
                                        </label>
                                        <select
                                                id="gyms"
                                                on:change={e => setLocation(e)}
                                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        >
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
                            type="custom-secondary"
                            onClick={addEvent}
                            rounded="true"
                            width="w-full"
                            disabled={!event || !propsDate}
                    />
                    <Button
                            text="Abbrechen"
                            type="white"
                            onClick={closeDialog}
                            outline="true"
                            rounded="true"
                            width="w-full"
                            textColor="text-gray-700"
                    />
                </div>
            </div>
        </div>
    </div>
</div>
