<script lang="ts">
    import SupabaseService from "../../api/supabase-service";
    import TrophyIcon from "../ui/icons/TrophyIcon.svelte";
    import LoadingSpinner from "$lib/ui/LoadingSpinner.svelte";
    import type {Point} from "../../types/Point";
    import type {Gym} from "../../types/Gym";
    import type {User} from "../../types/User";
    import {onMount, onDestroy} from "svelte";
    import type {RealtimeChannel} from "@supabase/supabase-js";
    import {isLoggedIn, currentGym, gyms} from "../../store";

    let subscription: RealtimeChannel;

    $: users = [];
    let sortedUsers: User[] = [];
    let selectedGym: any;

    /**
     * fetch all users
     */
    async function fetchAllUsers() {
        try {
            let result = (await SupabaseService.getAllUsers()).users;
            users = result as User[];
        } catch (err: any) {
            console.log(err);
        }
    }

    /**
     * sort users by points
     * @returns
     */
    function sortUsers() {
        let currentGymObj: Gym;
        if ($currentGym) {
            currentGymObj = $currentGym;
        } else {
            currentGymObj = $currentGym;
        }

        const usersWithPoints = users.filter(
            (user: User) => user.points !== null
        );

        if ($currentGym) {
            const filteredUsers = usersWithPoints.map((user: User) => {
                let points: Point[];

                if (user.points) {
                    points = user.points.filter(
                        (point: Point) => Number(point.gymId) === currentGymObj.id
                    );
                }

                return {
                    uid: user.uid,
                    name: user.name,
                    avatar_url: user.avatar_url,
                    points: points[0] != undefined ? points[0].value : 0,
                    boardId: 0,
                };
            });

            sortedUsers = filteredUsers.sort((a: any, b: any) => {
                return b.points - a.points;
            });

            // Set the boardId of each user to be the same if the points are the same
            for (let i = 0; i < sortedUsers.length; i++) {
                if (sortedUsers[i].points == sortedUsers[i - 1]?.points) {
                    sortedUsers[i].boardId = sortedUsers[i - 1].boardId;
                } else {
                    sortedUsers[i].boardId = i + 1;
                }
            }

            return sortedUsers;
        }
    }

    /**
     * update variables on gym change and set cacheItem
     * @param gym
     */
    async function changeGym(gym: string) {
        selectedGym = gym;
        const {id, logo, grades} = (await SupabaseService.getGymByName(gym)).gym;
        await SupabaseService.updateUserGym(id);
        currentGym.set({id: id, name: gym, logo: logo, grades: grades});
        await fetchAllUsers();
        sortUsers();
    }

    /**
     * on subscription insert
     * @param payload
     */
    function onInsert(payload: any) {
        users.push(payload.new);
    }

    /**
     * on subscription update
     */
    async function onUpdate() {
        await fetchAllUsers();
        sortUsers();
    }

    /**
     * gets called on init
     */
    onMount(async () => {
        subscription = SupabaseService.subscribeToTable(
            "progress",
            "users-channel",
            onInsert,
            onUpdate
        );
        subscription.subscribe();

        await fetchAllUsers();

        if ($isLoggedIn) {
            let current_gym_id: number = 1;
            let currentGymName: string = "";

            if ($currentGym) {
                current_gym_id = $currentGym.id;
                currentGymName = $currentGym.name;
            } else {
                if (current_gym_id) {
                    currentGymName = (await SupabaseService.getGymNameById(current_gym_id))?.gym?.name;
                }
            }

            const {id, name, logo, grades} = (
                await SupabaseService.getGymByName(currentGymName)
            ).gym;

            currentGym.set({id: id, name: name, logo: logo, grades: grades});
        }
        sortUsers();
    });

    /**
     * gets called on:
     * 1) page reload
     * 2) navigation to another page
     */
    onDestroy(() => {
        if (subscription) {
            subscription.unsubscribe();
        }
    });
</script>

<select
        id="gyms"
        on:change={e => changeGym(e.target.value)}
        class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
>
    <option selected>
        {#if $currentGym}
            {$currentGym.name}
        {:else if $currentGym}
            {$currentGym.name}
        {:else}
            Bitte auswählen...
        {/if}
    </option>
    {#if $gyms}
        {#each $gyms as gym}
            {#if $currentGym && gym.name !== $currentGym.name}
                <option value={gym.name}>{gym.name}</option>
            {:else if $currentGym && gym.name !== $currentGym.name}
                <option value={gym.name}>{gym.name}</option>
                {$currentGym.name}
            {:else if !$isLoggedIn}
                <option value={gym.name}>{gym.name}</option>
            {/if}
        {/each}
    {/if}
</select>

{#if users}
    <div class="px-2">
        <table class="table table-zebra w-full shadow-md board-table">
            <thead>
            <tr>
                <th>#</th>
                <th>Benutzer</th>
                <th>Punkte</th>
            </tr>
            </thead>
            <tbody>
            {#each sortedUsers as user, i}
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td class="px-3 py-2 w-1/12">
                        {#if i === 0}
                            <TrophyIcon color="text-custom-gold"/>
                        {:else if i === 1}
                            <TrophyIcon color="text-custom-silver"/>
                        {:else if i === 2}
                            <TrophyIcon color="text-custom-bronze"/>
                        {:else}
                            {user.boardId}
                        {/if}
                    </td>
                    <td class="px-3 py-2 w-10/12">
                        <div class="flex gap-5">
                            <div class="userImage w-10 h-10"
                                 style={`background-image: url(${user.avatar_url})`}
                            ></div>
                            <strong>{user.name}</strong>
                        </div>
                    </td>
                    <td class="px-3 py-2 w-1/12">{user.points}</td>
                </tr>
            {/each}
            </tbody>
        </table>
    </div>
{:else}
    <LoadingSpinner/>
{/if}
