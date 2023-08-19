<script lang="ts">
    export let text: string;
    export let color: string;

    switch (color) {
        case 'GRÜN':
            color = 'bg-custom-green text-white border-2 border-gray-400';
            break;
        case 'GELB':
            color = 'bg-custom-yellow text-white border-2 border-gray-400';
            break;
        case 'ORANGE':
            color = 'bg-custom-orange text-white border-2 border-gray-400';
            break;
        case 'BLAU':
            color = 'bg-custom-blue text-white border-2 border-gray-400';
            break;
        case 'WEISS':
            color = 'bg-white text-black border-2 border-gray-400';
            break;
        case 'TÜRKIS':
            color = 'bg-custom-turquiose text-white border-2 border-gray-400';
            break;
        case 'SCHWARZ':
            color = 'bg-black text-white border-2 border-gray-400';
            break;
        case 'ROT':
            color = 'bg-custom-red text-white border-2 border-gray-400';
            break;
    }
</script>

<div class={`${color} p-2.5 rounded-md w-full`}>
    {text}
</div>
