<svelte:head>
    <title>SaarClimb - Einstellungen</title>
    <meta name="description" content="Einstellungen"/>
</svelte:head>

<script lang="ts">
    import Cache from "../../cache";
    import {supabase} from "../../supabase";
    import Header from "$lib/features/Header.svelte";
    import Button from "$lib/ui/Button.svelte";
    import {goto} from "$app/navigation";
    import HelpIcon from "$lib/ui/icons/HelpIcon.svelte";
    import {dev} from '$app/environment'
    import Session from "../../session";
    import {onMount} from "svelte";
    import Toast from "$lib/ui/Toast";
    import SupabaseService from "../../api/supabase-service";

    $: gym = "";
    $: grades = "";
    let isAdmin: boolean = false;
    let gradesPlaceholder = '[\n\t{"value": "1-4b", "grade": "grün"},\n\t{"value": "4a-5b", "grade": "gelb"},\n]'

    /**
     * logout and navigate to login page
     */
    async function logout() {
        const {error} = await supabase.auth.signOut();
        Cache.clearOnLogout();
        await goto("/login");
    }

    function setGym(event: any) {
        gym = event.target.value;
    }

    function setGrades(event: any) {
        grades = event.target.value;
    }

    /**
     * add new gym to db
     */
    async function addGymToDb() {
        if (gym === "" || grades === "") {
            new Toast().push({content: Toast.GYM_ADDED_ERROR_MESSAGE, style: 'error', duration: 5000})
            return;
        }
        let newGym = {
            name: gym,
            grades: JSON.parse(grades)
        }
        try {
            await SupabaseService.insertGym(newGym);
            new Toast().push({content: Toast.GYM_ADDED_MESSAGE, style: 'success', duration: 3000})
        } catch(error) {
            new Toast().push({title: Toast.GYM_ADDED_ERROR_MESSAGE, content: error, style: 'error', duration: 5000})
        }
    }

    /**
     * check if user is admin
     */
    onMount(async () => {
        if (dev) isAdmin = true;
        else if (await Session.getCurrentUserId() === import.meta.env.VITE_ADMIN_USER) isAdmin = true;
    })

</script>

<main class="text-center mx-auto text-gray-700 mb-20">
    <Header headerText="Einstellungen"/>

    <div class="card card-compact shadow-xl bg-white">
        <div class="card-body">
            {#if isAdmin}
                <div class="admin-panel">
                    <h2 class="card-title">Admin Bereich</h2>
                    <div class="text-left">
                        <p class="text-lg mb-2">Neue Halle hinzufügen</p>
                        <form class="space-y-4 md:space-y-6" action="#">
                            <div>
                                <label for="gym"
                                       class="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white">Name
                                    der Halle</label>
                                <input type="text" name="gym" on:change={e => setGym(e)}
                                       class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       placeholder="Boulderwelt München Süd" required/>
                            </div>
                            <div>
                                <label for="grades"
                                       class="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white">Schwierigkeitsgrade</label>
                                <textarea
                                       name="grades" on:change={e => setGrades(e)}
                                       placeholder={gradesPlaceholder}
                                       value={gradesPlaceholder}
                                       class="h-56 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                       required/>
                            </div>
                        </form>
                        <br>
                        <Button
                                text="Halle hinzufügen"
                                type="custom-red"
                                outline="true"
                                rounded="true"
                                onClick={() => addGymToDb()}
                        />
                    </div>
                </div>
                <br/>
            {/if}


            <div>
                <h2 class="card-title float-left">Hilfe</h2>
                <div class="float-right">
                    <a href="https://saarclimb-docs.netlify.app/benutzerhandbuch/allgemein/">
                        <HelpIcon/>
                    </a>
                </div>
            </div>

            <div class="text-left">
                <p>
                    Bei Problemen oder Fragen wende dich bitte direkt an mich, den Entwickler. Du kannst mich per
                    E-Mail
                    unter
                    <b><a href="mailto:kreutzermaik123@web.de"> kreutzermaik123@web.de </a></b> erreichen.
                    Alternativ findest du möglicherweise auch im <b><a
                        href="https://saarclimb-docs.netlify.app/benutzerhandbuch/allgemein/"> Benutzerhandbuch </a></b>
                    eine Antwort auf deine Fragen.
                </p>
            </div>

            <hr>

            <div class="text-left mt-2">
                <Button
                        text="Ausloggen"
                        type="custom-red"
                        outline="true"
                        rounded="true"
                        onClick={() => logout()}
                />
            </div>
        </div>
    </div>
</main>
