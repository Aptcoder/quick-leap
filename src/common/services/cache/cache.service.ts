import { Cache } from "cache-manager"
import { Inject, Service } from "typedi"

export class CacheService {
    constructor(private readonly cache: Cache) {
        this.cache = cache
    }

    async get<T>(key: string) {
        return await this.cache.get<T>(key)
    }

    async set<T>(key: string, value: T, option?: { ttl: number }) {
        await this.cache.set(key, value, option?.ttl)
    }

    async delete(key: string) {
        await this.cache.del(key)
    }
}
