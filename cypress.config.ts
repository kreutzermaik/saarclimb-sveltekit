import {defineConfig} from "cypress";
import {lighthouse, prepareAudit} from "@cypress-audit/lighthouse";

export default defineConfig({
    e2e: {
        video: true,
        baseUrl: "http://localhost:5173",
        setupNodeEvents(on, config) {
            on("before:browser:launch", (browser: any = {}, launchOptions) => {
                prepareAudit(launchOptions);
            });
            on('task', {
                lighthouse: lighthouse()
            });
        },
    }
});
