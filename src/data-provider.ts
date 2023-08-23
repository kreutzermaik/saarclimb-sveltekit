import SupabaseService from "./api/supabase-service";
import Cache from "./cache";
import Session from "./session";
import type {Gym} from "./types/Gym";

export default class DataProvider {
  /**
   * init user data that is required for the app
   */
  static async initUserData() {
    if (this.checkProvider() === "google") {
      await this.initGoogleUser();
    }
    if (await Session.getCurrentUser()) {
      if ((await Session.getCurrentUser()).name === undefined) {
        await Session.updateUserInSession(JSON.parse(Cache.getCacheItem("username")));
      }
    }
    await this.addAvatar();
    await this.addAvatarUrlToCache();
    await this.addPlan();
    await this.initUserPoints();
  }

  /**
   * returns provider from cache
   * @returns
   */
  static checkProvider(): string {
    if (Cache.getCacheItem("sb-ybeongwjjfdkgizzkmsc-auth-token")) {
      return JSON.parse(
        Cache.getCacheItem("sb-ybeongwjjfdkgizzkmsc-auth-token")
      ).user.app_metadata.provider;
    }
    return "";
  }

  /**
   * init google user with data from cache
   */
  static async initGoogleUser() {
    let user = JSON.parse(
      Cache.getCacheItem("sb-ybeongwjjfdkgizzkmsc-auth-token")
    ).user;
    if (
      (await Session.getCurrentUser()) === null ||
      (await Session.getCurrentUser()) === undefined
    ) {
      await SupabaseService.addUser({
        uid: user?.id,
        email: user?.email,
        name: user?.user_metadata["full_name"],
        avatar_url: user?.user_metadata["avatar_url"],
      });
    }
  }

  /**
   * add avatar if not exists
   * gets only called if 'initAvatar' is not in the cache
   */
  static async addAvatar() {
    if (!Cache.getCacheItem("initAvatar")) {
      let avatar = await SupabaseService.getAvatar();
      if (avatar.data === null) {
        await SupabaseService.initAvatar();
      }
      Cache.setCacheItem("initAvatar", true);
    }
  }

  /**
   * add avatar url to cache with the key 'userImage'
   * gets only called if 'userImage' is not in the cache
   * if provider is google, the avatar url is taken from the session
   */
  static async addAvatarUrlToCache() {
    if (!Cache.getCacheItem("userImage")) {
      if (this.checkProvider() === "google") {
        let currentAvatarUrl = (await SupabaseService.getCurrentAvatarUrl())
          .avatar_url?.avatar_url;
        Cache.setCacheItem("userImage", currentAvatarUrl);
      } else {
        let data = await SupabaseService.getAvatar();
        if (data.data) {
          let url = data.data.signedUrl;
          await this.updateUserWithAvatarUrl(url);
          Cache.setCacheItem("userImage", url);
        }
      }
    }
  }

  /**
   * update avatar url in cache
   */
  static async updateAvatarUrlInCache() {
    let url = (await SupabaseService.getAvatar()).data?.signedUrl;
    Cache.setCacheItem("userImage", url);
    if (url) await this.updateUserWithAvatarUrl(url);
  }

  /**
   * update user table with avatar_url
   * @param avatarUrl
   */
  static async updateUserWithAvatarUrl(avatarUrl: string) {
    await SupabaseService.updateUser(avatarUrl);
  }

  /**
   * add plan if not exists
   * gets only called if 'initPlan' is not in the cache
   */
  static async addPlan() {
    if (!Cache.getCacheItem("initPlan")) {
      let plan = await SupabaseService.getPlan();
      if (plan.planer === null) {
        await SupabaseService.addPlan();
      }
      Cache.setCacheItem("initPlan", true);
    }
  }

  /**
   * init points in user table for all gyms with value 0
   * gets only called if 'initPoints' is not in the cache
   */
  static async initUserPoints() {
    if(!Cache.getCacheItem("initPoints")) {
      let pointsArray: { gymId: string; value: number; }[] = [];
      let gyms: Gym[] | null = (await SupabaseService.getGyms()).gym;
      gyms?.map(gym => {
        pointsArray.push({gymId: gym.id.toString(), value: 0})
      })
      await SupabaseService.updateUserPoints(pointsArray);
      Cache.setCacheItem("initPoints", true);
    }
  }
}
