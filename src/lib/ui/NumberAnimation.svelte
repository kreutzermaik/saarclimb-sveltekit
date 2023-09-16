<script>
    import { onMount } from 'svelte';

    export let targetValue = 0;
    let currentValue = 0;

    onMount(() => {
        const animationDuration = 2000; // Dauer der Animation in Millisekunden
        const updateInterval = 20; // Aktualisierungsintervall in Millisekunden
        const steps = Math.ceil(animationDuration / updateInterval);
        const stepValue = targetValue / steps;

        let step = 0;

        const animationInterval = setInterval(() => {
            currentValue += stepValue;
            step++;

            if (step >= steps) {
                currentValue = targetValue;
                clearInterval(animationInterval);
            }
        }, updateInterval);
    });
</script>

<style>
    .number {
        font-size: 24px;
        font-weight: bold;
    }
</style>

<div class="number">{Math.round(currentValue)}</div>
