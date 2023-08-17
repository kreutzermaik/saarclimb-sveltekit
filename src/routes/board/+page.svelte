<script>
    import Header from "../../lib/features/Header.svelte";
    import LeaderBoard from "$lib/features/LeaderBoard.svelte";
  </script>
  
  <div>
      <Header headerText="Bestenliste" />

      <div class="card card-compact shadow-xl bg-white">
          <div class="card-body">
              <LeaderBoard/>
          </div>
      </div>
  </div>