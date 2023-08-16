<script lang="ts">
  import Cache from "../../cache";
  import { supabase } from "../../supabase";
  import Header from "$lib/features/Header.svelte";
  import Button from "$lib/ui/Button.svelte";
  import { goto } from "$app/navigation";

  /**
   * logout and navigate to login page
   */
  async function logout() {
    const { error } = await supabase.auth.signOut();
    Cache.clearOnLogout();
    goto("/login");
  }
</script>

<main class="text-center mx-auto text-gray-700">
  <Header headerText="Einstellungen" />

  <div class="card card-compact shadow-xl bg-white">
    <div class="card-body">
      <div class="text-left">
        <Button
          text="Ausloggen"
          type="secondary"
          outline="true"
          rounded="true"
          onClick={() => logout()}
        />
      </div>
    </div>
  </div>
</main>
