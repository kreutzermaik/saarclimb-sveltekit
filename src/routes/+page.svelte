<script lang="ts">
  import SupabaseService from "../api/supabase-service";
  import Header from "../lib/features/Header.svelte";

  async function fetchAllUsers() {
    try {
      let result = (await SupabaseService.getAllUsers()).users;
      console.log(result);
      return result;
    } catch (err: any) {
      console.log(err);
    }
  }

  // fetchAllUsers();
</script>

<div>
  <Header headerText="Dashboard" />
  <a href="/login"> Login</a>
</div>
