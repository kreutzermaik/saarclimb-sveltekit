<script lang="ts">
  export let text: string;
  export let type: string;
  export let outline: string = "undefined";
  export let rounded: string = "undefined";
  export let width: string = "undefined";
  export let opacity: string = "undefined";
  export let textSize: string = "undefined";
  export let paddingX: string = "undefined";
  export let disabled: boolean = false;
  export let textColor: string = "text-white";
  export let onClick: Function = () => {};

  function handleClick() {
    onClick();
  }
</script>

<button
  on:click={handleClick}
  type="button"
  disabled={disabled === true}
  class={`bg-${type} ${width} ${opacity} ${paddingX} ${textSize} ${textColor} ${(outline === "true") ? "btn-outline border" : ""}
          ${(rounded === "true") ? "rounded-full" : "rounded-lg"} text-sm px-5 py-2 mr-2 mb-2 hover:opacity-75`}
>
  {text}
</button>
