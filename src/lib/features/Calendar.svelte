<script lang="ts">
  import * as FullCalendar from "@fullcalendar/core";
  import dayGridPlugin from "@fullcalendar/daygrid";
  import InteractionPlugin from "@fullcalendar/interaction";
  import { onDestroy, onMount } from "svelte";
  import SupabaseService from "../../api/supabase-service";
  import LoadingSpinner from "$lib/ui/LoadingSpinner.svelte";
  import AddEventDialog from "./AddEventDialog.svelte";
  import type {RealtimeChannel} from "@supabase/supabase-js";

  let subscription: RealtimeChannel;
  let calendarEl: any;
  let events: any = [];
  let selectedDate: any;

  /**
   * create fullcalendar with config
   */
  function createCalendar() {
    const calendar = new FullCalendar.Calendar(calendarEl as HTMLDivElement, {
      plugins: [dayGridPlugin, InteractionPlugin],
      initialView: "dayGridMonth",
      events: events,
      firstDay: 1,
      locale: "de",
      dateClick: handleDateClick,
    });
    calendar.render();
  }

  /**
   * fetch all events for current user
   * @returns
   */
  async function fetchEvents() {
    try {
      let result = (await SupabaseService.getEvents()).events;
      return parseAndSetEvents(result);
    } catch (err: any) {
      console.log(err);
    }
  }

  /**
   * parse events from supabase to calendar events
   * @param eventList
   * @returns
   */
  function parseAndSetEvents(eventList: any) {
    let eventArray: any[] = [];
    eventList.map((item: any) => {
      eventArray.push({ title: item.title, date: item.date });
    });
    return eventArray;
  }

  /**
   * set selected date on date click
   * @param event
   */
  function handleDateClick(event: any) {
    selectedDate = event.dateStr;
    openDialog();
  }

  /**
   * open dialog for adding a new event
   */
  function openDialog() {
    document.getElementById("event-dialog")?.classList.remove("hidden");
  }

  /**
   * on subscription insert
   * @param payload
   */
  function onInsert(payload: any) {
    events.push(payload.new);
    if (events) createCalendar();
  }

  /**
   * on subscription update
   */
  async function onUpdate() {
    events = await fetchEvents();
  }

  /**
   * subscribe to events table on mount
   */
  onMount(async () => {
    subscription = SupabaseService.subscribeToTable(
      "events",
      "event-channel",
      onInsert,
      onUpdate
    );
    subscription.subscribe();

    events = await fetchEvents();

    if (events) {
      createCalendar();
    }
  });

  /**
   * remove subscription on cleanup
   */
  onDestroy(() => {
    subscription.unsubscribe();
  });
</script>

<main class="text-gray-700">
  {#if events}
    <div
      class="max-sm:h-screen"
      style="max-height: 50vh"
      bind:this={calendarEl}
    />
  {:else}
    <LoadingSpinner />
  {/if}

  <AddEventDialog propsDate={selectedDate} />
</main>
