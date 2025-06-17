import { SetMetadata } from '@nestjs/common';

/**
 * Cache key metadata key
 */
export const CACHE_KEY_METADATA = 'cache_key_metadata';

/**
 * Cache TTL metadata key
 */
export const CACHE_TTL_METADATA = 'cache_ttl_metadata';

/**
 * Set the cache key for a controller method
 * @param key The cache key
 */
export const CacheKey = (key: string) => SetMetadata(CACHE_KEY_METADATA, key);

/**
 * Set the cache TTL for a controller method
 * @param ttl The TTL in seconds
 */
export const CacheTTL = (ttl: number) => SetMetadata(CACHE_TTL_METADATA, ttl);

/**
 * Skip caching for a controller method
 */
export const CACHE_SKIP_METADATA = 'cache_skip_metadata';
export const SkipCache = () => SetMetadata(CACHE_SKIP_METADATA, true);