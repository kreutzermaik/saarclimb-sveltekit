<script lang="ts">
  import { supabase } from "../../supabase";
  import Notification from "$lib/ui/Notification";
  import Button from "$lib/ui/Button.svelte";
  import { goto } from '$app/navigation';
  import SupabaseService from "../../api/supabase-service";
  import DataProvider from "../../data-provider";
  import Cache from "../../cache";
  
  export let type: string;

  $: name = "";
  $: email = "";
  $: password = "";

  function setName(event: any) {
    name = event.target.value;
    Cache.setCacheItem('username', name);
  }

  function setEmail(event: any) {
    email = event.target.value;
  }

  function setPassword(event: any) {
    password = event.target.value;
  }

  /**
   * login with google
   */
   async function loginWithGoogle() {
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google'
    })

    if (error) {
      Notification.show(Notification.LOGIN_ERROR_MESSAGE, error.message, 'error', 5000);
      return;
    }
  }

  /**
   * register with email and password
   */
  async function registerWithEmail() {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) {
      Notification.show(Notification.REGISTER_ERROR_MESSAGE, error.message, 'error', 5000);
      return;
    }

    await SupabaseService.addUser({ uid: data.user?.id, email: data.user?.email, name: name, avatar_url: '' });
    await DataProvider.initUserData()
    
    Notification.show(Notification.REGISTERED_MESSAGE);

    await goto('/');
  }

  /**
   * login with email and password
  */
  async function loginWithEmail() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      Notification.show(Notification.LOGIN_ERROR_MESSAGE, error.message, 'error', 5000);
      return;
    }

    await goto('/');
  }
</script>

<div>
  {#if type === "login"}
	   <div class="login-container p-6 mx-auto space-y-4 md:space-y-6 sm:p-8">
    <button type="button" on:click={loginWithGoogle} class="text-secondary btn-outline border hover:bg-secondary/90 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2 w-full">
      <svg class="w-4 h-4 mr-2 -ml-1" aria-hidden="true" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
      <span>Mit Google einloggen</span>
    </button>

    <hr />
    <form class="space-y-4 md:space-y-6" action="#">
      <div>
        <label for="email" class="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white">E-Mail Adresse</label>
        <input type="email" name="email" id="email-field" on:change={e => setEmail(e)} class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@email.com" required="" />
      </div>
      <div>
        <label for="password" class="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white">Passwort</label>
        <input type="password" name="password" id="password-field" on:change={e => setPassword(e)} placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
      </div>
      <Button text="Einloggen" type="secondary" onClick={loginWithEmail} />
      <hr />
      <p class="text-sm font-light text-gray-500 dark:text-gray-400">
        Du hast noch keinen Account? <a href="/register" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Registrieren</a>
      </p>
    </form>
  </div>
{/if}
{#if type === "register"}
<div class="login-container p-6 mx-auto space-y-4 md:space-y-6 sm:p-8">
  <form class="space-y-4 md:space-y-6" action="#">
    <div>
      <label for="name" class="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white">Vollständiger Name</label>
      <input type="name" name="name" on:change={e => { setName(e) }} id="name" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Max Mustermann" required="" />
    </div>
    <div>
      <label for="email" class="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white">E-Mail Adresse</label>
      <input type="email" name="email" on:change={e => { setEmail(e) }} id="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@email.com" required="" />
    </div>
    <div>
      <label for="password" class="block mb-2 text-sm text-left font-medium text-gray-900 dark:text-white">Passwort</label>
      <input type="password" name="password" on:change={e => { setPassword(e) }} id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
    </div>
    <Button text="Registrieren" type="secondary" onClick={registerWithEmail} />
    <hr />
    <p class="text-sm font-light text-gray-500 dark:text-gray-400">
      Zurück zum <a href="/login" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Login</a>
    </p>
  </form>
</div>
{/if}
</div>
