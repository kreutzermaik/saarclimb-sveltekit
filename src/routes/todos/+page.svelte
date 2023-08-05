<svelte:head>
  <title>Todos</title>
  <meta name="description" content="Todos" />
</svelte:head>

<script lang="ts">
  type Todo = {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
  };
  export let todos: Todo[] = [];

  async function fetchResponse() {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    todos = await response.json();
  }

  fetchResponse();
</script>

<div class="text-column">
  <h1>Todos</h1>

  {#each todos as todo}
    <div>
      <p>{todo.title}</p>
    </div>
  {/each}
</div>
