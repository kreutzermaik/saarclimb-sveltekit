import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig} from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

export default defineConfig({
    plugins: [
        sveltekit(),
        SvelteKitPWA({
            manifest: {
                icons: [
                    {
                        src: "logo.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any maskable"
                    }
                ]
            }
        })
    ]
});
