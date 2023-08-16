<script lang="ts">
  import * as FullCalendar from "@fullcalendar/core";
  import dayGridPlugin from "@fullcalendar/daygrid";
  import InteractionPlugin from "@fullcalendar/interaction";
  import { onDestroy, onMount } from "svelte";
  import SupabaseService from "../../api/supabase-service";
  import LoadingSpinner from "$lib/ui/LoadingSpinner.svelte";

  let subscription: any;

  let calendarEl: any;
  let events: any = [];
  let selectedDate;
  //   const [calendarEl, setCalendarEl] = createSignal(null);
  //   const [events, setEvents] = createSignal<Event[]>();
  //   const [selectedDate, setSelectedDate] = createSignal();

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
    events = (prev: any) => [...prev, payload.new];
    if (events) createCalendar();
  }

  /**
   * on subscription update
   */
  async function onUpdate() {
    events = await fetchEvents();
  }

  /**
   * on subscription delete
   * @param payload
   */
  function onDelete(payload: any) {
    // setEvents((prev: any) =>
    //   prev.filter((item: any) => item.id != payload.old.id)
    // );
  }

  /**
   * subscribe to events table on mount
   */
  onMount(async () => {
    events = await fetchEvents();

    subscription = SupabaseService.subscribeToTable(
      "events",
      "event-channel",
      onInsert,
      onUpdate,
      onDelete
    );

    if (events) {
      createCalendar();
    }
  });

  /**
   * remove subscription on cleanup
   */
  onDestroy(() => {
    subscription?.unsubscribe();
  });
</script>

<main class="text-gray-700">
  {#if events}
    <!-- <div
      class="max-sm:h-screen"
      style="max-height: 50vh"
      ref={(el) => calendarEl = el}
    /> -->
  {:else}
    <LoadingSpinner />
  {/if}

  <!-- <AddEventDialog date={selectedDate} /> -->
</main>
