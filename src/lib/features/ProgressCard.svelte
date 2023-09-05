<script lang="ts">
    import SupabaseService from "../../api/supabase-service";
    import type {Gym} from "../../types/Gym";
    import type {Progress} from "../../types/Progress";
    import type {ProgressItem} from "../../types/ProgressItem";
    import Cache from "../../cache";
    import Notification from "$lib/ui/Notification";
    import Button from "$lib/ui/Button.svelte";
    import {onDestroy, onMount} from "svelte";
    import type {RealtimeChannel} from "@supabase/supabase-js";

    let subscription: RealtimeChannel;

    let gyms: Gym[] = [];
    let usersGym: any;
    let currentGym: Gym;
    let selectedGym: any;
    let progress: Progress[] = [];
    let color: string = '';

    /**
     * fetch gym for current user
     * @returns
     */
    async function fetchUsersCurrentGym() {
        try {
            let result = (await SupabaseService.getCurrentGym()).gym;
            usersGym = result;
            return result;
        } catch (err: any) {
            console.log(err);
        }
    }

    /**
     * fetch all gyms
     * @returns
     */
    async function fetchGyms(): Promise<Gym[] | undefined> {
        try {
            let result = (await SupabaseService.getGyms()).gym;
            const gymsResult = result?.map((item: { [x: string]: any }) => {
                const {id, name, grades} = item;
                return {id, name, grades} as Gym;
            });
            gyms = result as Gym[];
            return gymsResult;
        } catch (err: any) {
            console.log(err);
        }
    }

    /**
     * fetch progress object
     * @returns
     */
    async function fetchProgress(gymId: number) {
        try {
            let result = (await SupabaseService.getProgress(gymId)).progress;
            if (result) progress = result as Progress[];
            return progress;
        } catch (err: any) {
            console.log(err);
        }
    }

    /**
     * update gym name in the select field
     * update different values that are affected by the gym change
     * @param e
     */
    async function changeGym(e: any) {
        const gym = e.target.value;
        selectedGym = gym;
        const {id, logo, grades} = (await SupabaseService.getGymByName(gym)).gym;
        usersGym = await fetchUsersCurrentGym();
        if (usersGym !== undefined && usersGym.gym !== null) {
            await SupabaseService.updateUserGym(id);
        }
        currentGym = {id: id, name: gym, logo: logo, grades: grades};
        await fetchProgress(id);
        Cache.setCacheItem("currentGym", currentGym);
    }

    /**
     * push new entry for progress table
     * @param grades
     */
    async function initProgressDataForGym(grades: ProgressItem[]) {
        let array: any[] = [];
        grades.map((item: ProgressItem) => {
            array.push({grade: item, value: 0});
        });
        await SupabaseService.insertProgress(array, currentGym.id);
        await fetchProgress(currentGym.id);
        Notification.show(Notification.GYM_VALUES_ADDED_MESSAGE);
        await fetchProgress(currentGym.id);
    }

    /**
     * update progress value
     * @param value
     * @param grade
     */
    async function updateProgress(value: number, grade: string) {
        progress.map((item: Progress) => {
            if (item.gymid === currentGym.id) {
                item.progress.find((item: ProgressItem) => item.grade === grade).value = value;
            }
        });

        await SupabaseService.updateProgress(
            progress.find((item: Progress) => item.gymid === currentGym.id)
                .progress,
            currentGym.id
        );

        let currentUserPointsArray = await SupabaseService.getCurrentPoints();
        currentUserPointsArray.points?.points.map((item: any) => {
            if (Cache.getCacheItem("currentGym")) {
                if (Number(item.gymId) === JSON.parse(Cache.getCacheItem("currentGym")).id) {
                    item.value = calculatePoints();
                }
            }
        });

        await SupabaseService.updateUserPoints(currentUserPointsArray.points?.points);
    }

    /**
     * calculate points for current user
     * every grade has a multiplier that is increased by 2 for every grade
     * @returns
     */
    function calculatePoints(): number {
        let points = 0;
        progress.map((item: Progress) => {
            let multiplier = 2;
            item.progress.map((item: any, i: number) => {
                if (i > 0) {
                    multiplier += 2;
                }
                points += multiplier * item.value;
            });
        });
        return points;
    }

    /**
     * increment input value by 1 and update progress
     * @param item
     */
    function incrementValue(item: ProgressItem) {
        const newValue = Number(item.value) + 1;
        let inputElement: any = document.getElementById(`input-${item.grade}`);
        inputElement.value = newValue;
        updateProgress(newValue, item.grade);
    }

    /**
     * decrement input value by 1 and update progress
     * @param item
     */
    function decrementValue(item: ProgressItem) {
        const newValue = Number(item.value) - 1;
        let inputElement: any = document.getElementById(`input-${item.grade}`);
        if (newValue >= 0) {
            inputElement.value = newValue;
            updateProgress(newValue, item.grade);
        }
    }

    /**
     * hotfix for <Chip/> Bug
     * @param color
     */
    function setColor(color: string) {
        switch (color) {
            case 'GRÜN':
                color = 'bg-custom-green text-white border-2 border-gray-400';
                break;
            case 'GELB':
                color = 'bg-custom-yellow text-white border-2 border-gray-400';
                break;
            case 'ORANGE':
                color = 'bg-custom-orange text-white border-2 border-gray-400';
                break;
            case 'BLAU':
                color = 'bg-custom-blue text-white border-2 border-gray-400';
                break;
            case 'WEISS':
                color = 'bg-white text-black border-2 border-gray-400';
                break;
            case 'TÜRKIS':
                color = 'bg-custom-turquiose text-white border-2 border-gray-400';
                break;
            case 'SCHWARZ':
                color = 'bg-black text-white border-2 border-gray-400';
                break;
            case 'ROT':
                color = 'bg-custom-red text-white border-2 border-gray-400';
                break;
        }
        return color;
    }

    /**
     * on subscription insert
     * @param payload
     */
    function onInsert(payload: any) {
        progress.push(payload.new);
    }

    /**
     * on subscription update
     */
    async function onUpdate() {
        await fetchProgress(currentGym.id);
    }

    onMount(async () => {
        subscription = SupabaseService.subscribeToTable(
            "progress",
            "progress-channel",
            onInsert,
            onUpdate
        );
        subscription.subscribe();

        await fetchGyms();

        let currentGymId: number = 0;
        let currentGymName: string = "";

        if (Cache.getCacheItem("currentGym")) {
            currentGymId = JSON.parse(Cache.getCacheItem("currentGym")).id;
            currentGymName = JSON.parse(Cache.getCacheItem("currentGym")).name;
        } else {
            currentGymId = (await fetchUsersCurrentGym())?.gym;
            if (currentGymId) {
                currentGymName = (await SupabaseService.getGymNameById(currentGymId)).gym?.name;
            }
        }

        const {id, name, logo, grades} = (
            await SupabaseService.getGymByName(currentGymName)
        ).gym;

        currentGym = {id: id, name: name, logo: logo, grades: grades};
        await fetchProgress(currentGymId);
    });

    onDestroy(() => {
        subscription.unsubscribe();
    });

</script>


<div class="card card-compact shadow-xl bg-white text-left mb-20">
    <div class="card-body">
        <h2 class="card-title">Boulderhalle auswählen</h2>
        <label for="gyms" class="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white">
            Aktuelle Halle
        </label>
        <select
                id="gyms"
                on:change={e => changeGym(e)}
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
            <option selected>
                {#if Cache.getCacheItem("currentGym")}
                    {JSON.parse(Cache.getCacheItem("currentGym")).name}
                {:else if currentGym}
                    {currentGym.name}
                {:else}
                    Bitte auswählen...
                {/if}
            </option>
            {#each gyms as gym}
                <option value={gym.name}>{gym.name}</option>
            {/each}
        </select>

        <br/>

        {#if progress.length > 0}
            <table class="table table-zebra w-full shadow-md">
                <thead>
                <tr>
                    <th class="text-sm normal-case">Erledigte Boulder</th>
                    <th class="text-sm normal-case">Schwierigkeitsgrad</th>
                </tr>
                </thead>
                <tbody>
                {#each progress as item}
                    {#each item.progress as progressItem}
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td class="px-3 py-2 w-2/12">
                                <Button
                                        text="-"
                                        type="secondary"
                                        opacity="opacity-80"
                                        textSize="text-lg"
                                        paddingX="px-3.5"
                                        onClick={() => decrementValue(progressItem)}
                                />
                                <input
                                        type="number"
                                        name="number"
                                        id={`input-${progressItem.grade}`}
                                        min={0}
                                        on:change={e => updateProgress(e.target?.value, progressItem.grade)}
                                        value={progressItem.value}
                                        class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 mr-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-14 lg:w-44"
                                />
                                <Button
                                        text="+"
                                        type="secondary"
                                        opacity="opacity-80"
                                        textSize="text-lg"
                                        paddingX="px-3.5"
                                        onClick={() => incrementValue(progressItem)}
                                />
                            </td>
                            <td class="px-3 py-2 w-9/12">
                                <div class="flex gap-5">
                                    <div class={`${setColor(progressItem.grade.toUpperCase())} p-2.5 rounded-md w-full`}>
                                        {progressItem.grade.toUpperCase()}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    {/each}
                {/each}
                </tbody>
            </table>
        {:else}
            <Button
                    text="Starte mit dieser Boulderhalle!"
                    type="secondary"
                    onClick={() => initProgressDataForGym(currentGym.grades)}
            />
        {/if}
    </div>
</div>