<script lang="ts">
    import ArrowDownIcon from "$lib/ui/icons/ArrowDownIcon.svelte";
    import InfoIcon from "$lib/ui/icons/InfoIcon.svelte";
    import {onDestroy, onMount} from "svelte";
    import SupabaseService from "../../api/supabase-service";
    import type {Plan} from "../../types/Plan";
    import FailedIcon from "$lib/ui/icons/FailedIcon.svelte";
    import LoadingSpinner from "$lib/ui/LoadingSpinner.svelte";
    import CheckDisabledIcon from "$lib/ui/icons/CheckDisabledIcon.svelte";
    import CheckIcon from "$lib/ui/icons/CheckIcon.svelte";
    import UnusedIcon from "$lib/ui/icons/UnusedIcon.svelte";
    import type {RealtimeChannel} from "@supabase/supabase-js";
    import type {Event} from "../../types/Event";
    import Session from "../../session";
    import AskLocationDialog from "$lib/features/AskLocationDialog.svelte";
    import Toast from "$lib/ui/Toast";

    let plan: Plan[] = [];
    let subscription: RealtimeChannel;
    let newEvent: Event;

    /**
     * fetch data from SupabaseService
     * @returns
     */
    async function fetchPlan() {
        try {
            return (await SupabaseService.getPlan()).planer.plan;
        } catch (err: any) {
            console.log(err);
        }
    }

    /**
     * update ui and supabase plans
     * @param item
     */
    function updatePlan(item: Plan) {
        updateCalendar(item);
        item.checked = !item.checked;
        SupabaseService.updatePlan(plan);
    }

    /**
     * update calendar with finished training session
     * @param item
     */
    async function updateCalendar(item: Plan) {
        let event = item.value;
        let date = getClickedDay(item.day);
        newEvent = {
            title: event,
            date: date,
            userid: await Session.getCurrentUserId(),
            location: '',
        };
        // open AskLocationDialog if event is a climbing event
        if (event.match("Kletter") || event.match("Boulder") || event.match("Climb")) {
            if (item.checked) openDialog();
            await SupabaseService.removeEventByDate(event, date);
        } else {
            if (item.checked) await SupabaseService.addEvent(newEvent);
            else await SupabaseService.removeEvent(newEvent);
        }
    }

    /**
     * get exact day of the week that was clicked in planer checkbox
     * @param day
     */
    function getClickedDay(day: string) {
        const today = new Date();
        const dayIndex = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'].indexOf(day);
        const difference = dayIndex - today.getDay() + 1;
        today.setDate(today.getDate() + difference);
        return formatDate(today);
    }

    /**
     *
     * @param date
     */
    function formatDate(date: Date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        return [year, month, day].join('-');
    }

    /**
     * open dialog for adding a new event
     */
    function openDialog() {
        document.getElementById("ask-location-dialog")?.classList.remove("hidden");
    }

    /**
     * check if day is in past of week
     * @param day
     * @returns
     */
    function isDayPast(day: Plan): boolean {
        let dayToCompare = new Date();
        let weekday = new Array(7);
        weekday[1] = "Montag";
        weekday[2] = "Dienstag";
        weekday[3] = "Mittwoch";
        weekday[4] = "Donnerstag";
        weekday[5] = "Freitag";
        weekday[6] = "Samstag";
        weekday[7] = "Sonntag";

        for (let i = 0; i < weekday.length; i++) {
            if (weekday[i] === day.day) {
                if (dayToCompare.getDay() === 0 && i < 7) return true;
                else if (i < dayToCompare.getDay()) return true;
                else if (i >= dayToCompare.getDay()) return false;
            }
        }
        return false;
    }

    /**
     * show planned exercise as notification
     * @param item
     */
    function showPlannedExercise(item: Plan) {
        if (item.value !== '') {
            new Toast().push({title: Toast.PLANNED_EXERCISE, content: item.value,
                position: 'top-right', style: 'verified', duration: 5000});
        }
    }

    /**
     * on subscription insert
     * @param payload
     */
    function onInsert(payload: any) {
        // plan = (prev: any) => [...prev, payload.new];
    }

    /**
     * on subscription update
     */
    async function onUpdate() {
        plan = await fetchPlan();
    }

    onMount(async () => {
        plan = await fetchPlan();
        subscription = SupabaseService.subscribeToTable(
            "planer",
            "planer-channel",
            onInsert,
            onUpdate
        );
        subscription.subscribe();
    });

    onDestroy(() => {
        if (subscription) {
            subscription.unsubscribe();
        }
    });
</script>

<main class="text-center mx-auto text-gray-700">
    <div class="card card-compact shadow-xl bg-white z-0">
        <div class="card-body">
            <div>
                <h2 class="card-title float-left">Wochenplan</h2>
                <div
                        class="tooltip tooltip-left tooltip-primary float-right z-50"
                        data-tip="Hier kannst du für die ganze Woche deine geplanten
                Bouldereinheiten sowie Workouts verfolgen. Über die Icons kannst du deine Einheiten abhaken, sofern du Sie erledigt hast.
                Über das Pfeil-Symbol gelangst du zu deinem detaillierten Wochenplan."
                >
                    <InfoIcon/>
                </div>
            </div>

            {#if plan !== undefined && plan.length > 0}
                <table class="table w-full">
                    <thead>
                    <tr>
                        {#each plan as item}
                            <th class="bg-white text-black">
                                <button class={item.value === '' ? 'cursor-default' : 'cursor-pointer'}
                                        on:click={showPlannedExercise(item)}>{item.day.slice(0, 2)}
                                </button>
                            </th>
                        {/each}
                    </tr>
                    </thead>
                    <tbody>
                    <tr
                            class="bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                        {#each plan as item}
                            <td class="bg-white px-3 py-2">
                                {#if isDayPast(item) && !item.checked && item.value !== ""}
                                    <button on:click={() => updatePlan(item)}>
                                        <div
                                                class={`tooltip ${item.day === "Montag" ? 'tooltip-right' : item.day === "Sonntag" ? 'tooltip-left' : 'tooltip-bottom'} tooltip-primary float-right mb-4 z-50`}
                                                data-tip={"Workout verpasst: " + item.value}
                                        >
                                            <FailedIcon/>
                                        </div>
                                    </button>
                                {:else if !isDayPast(item) && !item.checked && item.value !== ""}
                                    <button on:click={() => updatePlan(item)}>
                                        <div
                                                class={`tooltip ${item.day === "Montag" ? 'tooltip-right' : item.day === "Sonntag" ? 'tooltip-left' : 'tooltip-bottom'} tooltip-primary float-right mb-4 z-50`}
                                                data-tip={item.value}
                                        >
                                            <CheckDisabledIcon/>
                                        </div>
                                    </button>
                                {:else if item.checked}
                                    <button on:click={() => updatePlan(item)}>
                                        <div
                                                class={`tooltip ${item.day === "Montag" ? 'tooltip-right' : item.day === "Sonntag" ? 'tooltip-left' : 'tooltip-bottom'} tooltip-primary float-right mb-4 z-50`}
                                                data-tip={item.value}
                                        >
                                            <CheckIcon/>
                                        </div>
                                    </button>
                                {:else if !item.checked}
                                    <div class={`tooltip ${item.day === "Montag" ? 'tooltip-right' : item.day === "Sonntag" ? 'tooltip-left' : 'tooltip-bottom'} tooltip-primary mb-4`}
                                         data-tip="Kein Workout geplant">
                                        <UnusedIcon/>
                                    </div>
                                {/if}
                            </td>
                        {/each}
                    </tr>
                    </tbody>
                </table>
            {:else}
                <LoadingSpinner/>
            {/if}

            <a href="/plan">
                <ArrowDownIcon/>
            </a>
        </div>
    </div>
    <AskLocationDialog newEvent={newEvent}/>
</main>
