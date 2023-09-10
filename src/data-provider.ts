import SupabaseService from "./api/supabase-service";
import Cache from "./cache";
import Session from "./session";
import type {Gym} from "./types/Gym";
import type {User} from "./types/User";
import {userImage} from "./store";

export default class DataProvider {
    /**
     * init user data that is required for the app
     */
    static async initUserData(): Promise<void> {
        if (await Session.getCurrentUser()) {
            if ((await Session.getCurrentUser()).name === undefined) {
                await Session.updateUserInSession(JSON.parse(Cache.getCacheItem("username")));
            }
        }
        await SupabaseService.addUser(await Session.getCurrentUser() as User);
        await this.addPlan();
        await this.initUserPoints();
    }

    /**
     * update avatar url in cache
     */
    static async updateAvatarUrlInCache(): Promise<void> {
        let url = (await SupabaseService.getAvatar()).data?.signedUrl;
        if (url) {
            userImage.set(url);
            await this.updateUserWithAvatarUrl(url);
        }
    }

    /**
     * update user table with avatar_url
     * @param avatarUrl
     */
    static async updateUserWithAvatarUrl(avatarUrl: string): Promise<void> {
        await SupabaseService.updateUser(avatarUrl);
    }

    /**
     * add plan if not exists
     * gets only called if 'initPlan' is not in the cache
     */
    static async addPlan(): Promise<void> {
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
    static async initUserPoints(): Promise<void> {
        if (!Cache.getCacheItem("initPoints")) {
            let user = await SupabaseService.getCurrentPoints();
            if (!user?.points?.points) {
                let pointsArray: { gymId: string; value: number; }[] = [];
                let gyms: Gym[] | null = (await SupabaseService.getGyms()).gym;
                gyms?.map((gym: Gym): void => {
                    pointsArray.push({gymId: gym.id.toString(), value: 0})
                })
                await SupabaseService.updateUserPoints(pointsArray);
            }
            Cache.setCacheItem("initPoints", true);
        }
    }
}
