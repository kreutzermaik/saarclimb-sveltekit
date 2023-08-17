import {browser} from '$app/environment';

export default class Cache {

    /**
     * get item from cache
     * @param item
     * @returns
     */
    static getCacheItem(item: string): any {
        if (browser) {
            return window.localStorage.getItem(item);
        }
    }

    /**
     * set item in cache
     * @param item
     * @param value
     */
    static setCacheItem(item: string, value: any) {
        if (browser) {
            window.localStorage.setItem(item, JSON.stringify(value));
        }
    }

    /**
     * remove item from cache
     * @param item
     */
    static removeCacheItem(item: string) {
        if (browser) {
            window.localStorage.removeItem(item);
        }
    }

    /**
     * remove all items from cache
     */
    static clearOnLogout() {
        if (browser) {
            window.localStorage.clear();
        }
    }
}