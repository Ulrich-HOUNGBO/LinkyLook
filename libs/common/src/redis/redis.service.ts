import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType } from 'redis';

interface CacheEntry {
  value: string | null;
  expiresAt: number;
}

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private readonly prefix: string;
  private readonly ttl: number;
  private readonly inMemoryCache: Map<string, CacheEntry> = new Map();
  private readonly memoryCacheTTL: number = 60 * 10000; // 600 seconds in milliseconds

  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
    private readonly configService: ConfigService,
  ) {
    this.prefix = this.configService.get<string>('REDIS_PREFIX') || 'linklyst:';
    this.ttl = this.configService.get<number>('REDIS_TTL') || 604800; // 7 days in seconds
  }

  /**
   * Store a value in Redis with an optional TTL
   * @param key The key to store the value under
   * @param value The value to store
   * @param ttl Optional TTL in seconds (defaults to REDIS_TTL from config)
   */
  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      const prefixedKey = this.getKey(key);
      await this.redisClient.set(prefixedKey, value, {
        EX: ttl || this.ttl,
      });

      // Update in-memory cache
      this.inMemoryCache.set(prefixedKey, {
        value,
        expiresAt: Date.now() + this.memoryCacheTTL,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Error getting Redis key ${key}: ${error.message}`);
      } else {
        this.logger.error(`Error getting Redis key ${key}: ${String(error)}`);
      }
      throw error;
    }
  }

  /**
   * Get a value from Redis
   * @param key The key to retrieve
   * @returns The value or null if not found
   */
  async get(key: string): Promise<string | null> {
    try {
      const prefixedKey = this.getKey(key);

      // Check in-memory cache first
      const cached = this.inMemoryCache.get(prefixedKey);
      const now = Date.now();

      if (cached && cached.expiresAt > now) {
        this.logger.debug(`Cache hit for key ${key}`);
        return cached.value;
      }

      // If not in cache or expired, get from Redis
      const value = await this.redisClient.get(prefixedKey);

      // Update in-memory cache
      this.inMemoryCache.set(prefixedKey, {
        value,
        expiresAt: now + this.memoryCacheTTL,
      });

      return value;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Error getting Redis key ${key}: ${error.message}`);
      } else {
        this.logger.error(`Error getting Redis key ${key}: ${String(error)}`);
      }
      throw error;
    }
  }

  /**
   * Delete a key from Redis
   * @param key The key to delete
   */
  async del(key: string): Promise<void> {
    try {
      const prefixedKey = this.getKey(key);
      await this.redisClient.del(prefixedKey);

      // Remove from in-memory cache
      this.inMemoryCache.delete(prefixedKey);
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Error getting Redis key ${key}: ${error.message}`);
      } else {
        this.logger.error(`Error getting Redis key ${key}: ${String(error)}`);
      }
      throw error;
    }
  }

  /**
   * Check if a key exists in Redis
   * @param key The key to check
   * @returns True if the key exists, false otherwise
   */
  async exists(key: string): Promise<boolean> {
    try {
      const prefixedKey = this.getKey(key);

      // Check in-memory cache first
      const cached = this.inMemoryCache.get(prefixedKey);
      if (cached && cached.expiresAt > Date.now()) {
        return cached.value !== null;
      }

      const result = await this.redisClient.exists(prefixedKey);
      return result === 1;
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logger.error(`Error getting Redis key ${key}: ${error.message}`);
      } else {
        this.logger.error(`Error getting Redis key ${key}: ${String(error)}`);
      }
      throw error;
    }
  }

  /**
   * Get the prefixed key
   * @param key The key to prefix
   * @returns The prefixed key
   */
  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }
}
