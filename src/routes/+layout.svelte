<script>
  import "../app.postcss";
  import Navbar from "../lib/features/Navbar.svelte";
  import "./styles.css";
</script>

<div class="app">
  <Navbar />

  <main>
    <slot />
  </main>
</div>