<script lang="ts">
  import SupabaseService from "../../api/supabase-service";
  import type {Plan} from "../../types/Plan";
  import Notification from "$lib/ui/Notification";
  import {onDestroy, onMount} from "svelte";
  import Cache from "../../cache";
  import LoadingSpinner from "$lib/ui/LoadingSpinner.svelte";
  import ResetIcon from "$lib/ui/icons/TrashIcon.svelte";
  import Button from "$lib/ui/Button.svelte";
  import InfoIcon from "$lib/ui/icons/InfoIcon.svelte";
  import type {RealtimeChannel} from "@supabase/supabase-js";

  let subscription: RealtimeChannel;

  let plan: Plan[] = [];

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
   * save input changes
   * @param element
   * @param day
   */
  function setInputValue(element: HTMLInputElement, day: Plan) {
    const checkbox = document.querySelector(
      ".".concat(day.day, "-checkbox")
    ) as HTMLInputElement;
    // set value
    day.value = element.value;
    // update ui elements
    if (element.value === "") {
      element.classList.remove("border-primary");
      element.classList.add("placeholder-gray-500");
      element.classList.add("bg-neutral");
      checkbox.checked = false;
    } else {
      element.classList.remove("bg-neutral");
      element.classList.add("border-primary");
    }
  }

  /**
   * update plan in supabase
   */
  function updatePlan() {
    try {
      SupabaseService.updatePlan(plan);
      Notification.show(Notification.PLAN_UPDATED_MESSAGE);
    } catch (err: any) {
      Notification.show(
        Notification.PLAN_UPDATED_ERROR_MESSAGE,
        err.message,
        "error",
        5000
      );
    }
  }

  /**
   * resetPlan in UI
   */
  function resetPlan() {
    plan?.map((day: any) => {
      day.value = "";
      day.checked = false;
    });
    plan = plan?.map(({ day, value, checked }) => ({ day, value, checked }));
    updatePlan();
  }

  /**
   * reset single day in UI
   * @param day
   */
  function resetDay(day: Plan) {
    day.value = "";
    day.checked = false;
    plan = plan?.map(({ day, value, checked }) => ({ day, value, checked }));
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
    Cache.setCacheItem("plan", plan);
  }

  onMount(async () => {
    subscription = SupabaseService.subscribeToTable(
            "progress",
            "planer-channel",
            onInsert,
            onUpdate
    );
    subscription.subscribe();

    plan = await fetchPlan();

    const planCache: any = Cache.getCacheItem("plan");
    if (planCache) {
      plan = JSON.parse(planCache);
    } else {
      Cache.setCacheItem("plan", plan);
    }
  });

  onDestroy(() => {
    subscription.unsubscribe();
    Cache.removeCacheItem("plan");
  });
</script>

<main class="text-center text-gray-700">
  {#if plan}
    <div class="mb-6">
      <h2 class="card-title float-left">Deine Trainingseinheiten</h2>
      <div
        class="tooltip tooltip-left tooltip-primary float-right mb-4 z-50"
        data-tip="Hier kannst du für die ganze Woche deine geplanten
                Bouldereinheiten sowie Workouts planen. Gib dazu einfach eine Einheit in ein Textfeld ein und klick auf Speichern. 
                Durch das Reset-Symbol setzt du den Wert für ein Eingabefeld zurück. 
                Über Zurücksetzen werden alle eingegebenen Werte geleert."
      >
        <InfoIcon />
      </div>

      <table class="table table-zebra w-full shadow-md">
        <thead>
          <tr>
            <th>Tag</th>
            <th>Geplante Einheit</th>
          </tr>
        </thead>
        <tbody>
          {#each plan as item}
            <tr
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td class="px-3 py-2">
                <strong>{item.day.slice(0, 2)}</strong>
              </td>
              <td class="px-3 py-2 w-10/12">
                <div class="flex items-center justify-start gap-3">
                  <input
                    value={item.value}
                    on:change={(e) => setInputValue(e.currentTarget, item)}
                    type="text"
                    id={item.day}
                    class={`${
                      item.value !== ""
                        ? "border-primary"
                        : "bg-neutral text-black placeholder-gray-500"
                    } border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 max-w-7xl`}
                    placeholder="Nichts geplant"
                    required
                  />
                  {#if item.value !== ""}
                    <button on:click={() => resetDay(item)}>
                      <ResetIcon />
                    </button>
                  {:else}
                    <div class="w-6" />
                  {/if}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else}
    <LoadingSpinner />
  {/if}
  <Button
    text="Speichern"
    type="secondary"
    onClick={updatePlan}
    width="w-full"
  />
  <Button
    text="Zurücksetzen"
    type="white"
    onClick={resetPlan}
    outline="true"
    width="w-full"
    textColor="text-gray-700"
  />
</main>
