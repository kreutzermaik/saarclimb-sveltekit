<script>
  import { page } from "$app/stores";
  import DashboardIcon from "$lib/ui/icons/DashboardIcon.svelte";
  import MonitorIcon from "$lib/ui/icons/MonitorIcon.svelte";
  import ToolIcon from "$lib/ui/icons/ToolIcon.svelte";
  import UserGroupIcon from "$lib/ui/icons/UserGroupIcon.svelte";

  const activeTabColor = "text-secondary";
  const inActiveTabColor = "text-primary";
</script>

<header>
  <nav class="bg-white fixed bottom-0">
    <div class="grid grid-cols-4 w-screen gap-5 px-1 pt-1">
      <button
        class={`flex items-center justify-center flex-col cursor-pointer p-2`}
      >
        <a href="/">
          <DashboardIcon />
          <p class={`${$page.url.pathname === "/" ? activeTabColor : inActiveTabColor} text-sm`}>Dashboard</p>
        </a>
      </button>
      <button
        class={`flex items-center justify-center flex-col cursor-pointer p-2`}
      >
        <a href="/plan">
          <ToolIcon />
          <p class={`${$page.url.pathname === "/plan" ? activeTabColor : inActiveTabColor} text-sm`}>Planer</p>
        </a>
      </button>
      <button
        class={`flex items-center justify-center flex-col cursor-pointer p-2`}
      >
        <a href="/progress">
          <UserGroupIcon />
          <p class={`${$page.url.pathname === "/progress" ? activeTabColor : inActiveTabColor} text-sm`}>Fortschritt</p>
        </a>
      </button>
      <button
        class={`flex items-center justify-center flex-col cursor-pointer p-2`}
      >
        <a href="/board">
          <MonitorIcon />
          <p class={`${$page.url.pathname === "/board" ? activeTabColor : inActiveTabColor} text-sm`}>Ranking</p>
        </a>
      </button>
    </div>
  </nav>
</header>
