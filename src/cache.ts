export default class Cache {

    /**
     * get item from cache
     * @param item 
     * @returns 
     */
    static getCacheItem(item: string): any {
        return window.localStorage.getItem(item);
    }

    /**
     * set item in cache
     * @param item 
     * @param value 
     */
    static setCacheItem(item: string, value: any) {
        window.localStorage.setItem(item, JSON.stringify(value));
    }

    /**
     * remove item from cache
     * @param item 
     */
    static removeCacheItem(item: string) {
        window.localStorage.removeItem(item);
    }

    /**
     * remove all items from cache
     */
    static clearOnLogout() {
        window.localStorage.clear();
    }
}