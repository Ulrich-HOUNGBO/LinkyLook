import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly cachePrefix = 'cache:';

  constructor(private readonly redisService: RedisService) {}

  /**
   * Get a value from the cache
   * @param key The cache key
   * @returns The cached value or null if not found
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const cachedData = await this.redisService.get(this.getCacheKey(key));
      if (!cachedData) {
        return null;
      }
      return JSON.parse(cachedData) as T;
    } catch (error) {
      this.logger.error(
        `Error getting cached data for key ${key}: ${error.message}`,
      );
      return null;
    }
  }

  /**
   * Set a value in the cache
   * @param key The cache key
   * @param value The value to cache
   * @param ttl Optional TTL in seconds
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      await this.redisService.set(this.getCacheKey(key), stringValue, ttl);
    } catch (error) {
      this.logger.error(`Error setting cache for key ${key}: ${error.message}`);
    }
  }

  /**
   * Delete a value from the cache
   * @param key The cache key
   */
  async del(key: string): Promise<void> {
    try {
      await this.redisService.del(this.getCacheKey(key));
    } catch (error) {
      this.logger.error(
        `Error deleting cache for key ${key}: ${error.message}`,
      );
    }
  }

  /**
   * Check if a key exists in the cache
   * @param key The cache key
   * @returns True if the key exists, false otherwise
   */
  async exists(key: string): Promise<boolean> {
    try {
      return await this.redisService.exists(this.getCacheKey(key));
    } catch (error) {
      this.logger.error(
        `Error checking if cache key ${key} exists: ${error.message}`,
      );
      return false;
    }
  }

  /**
   * Get the full cache key with prefix
   * @param key The base key
   * @returns The prefixed cache key
   */
  private getCacheKey(key: string): string {
    return `${this.cachePrefix}${key}`;
  }
}
