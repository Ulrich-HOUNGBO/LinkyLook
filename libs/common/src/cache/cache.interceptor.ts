import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from './cache.service';
import { Reflector } from '@nestjs/core';
import { CACHE_KEY_METADATA, CACHE_SKIP_METADATA, CACHE_TTL_METADATA } from './cache.decorators';
import { Request } from 'express';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CacheInterceptor.name);

  constructor(
    private readonly cacheService: CacheService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    // Skip caching for non-GET requests
    const request = context.switchToHttp().getRequest<Request>();
    if (request.method !== 'GET') {
      return next.handle();
    }

    // Check if caching should be skipped for this handler
    const skipCache = this.reflector.get<boolean>(
      CACHE_SKIP_METADATA,
      context.getHandler(),
    );
    if (skipCache) {
      return next.handle();
    }

    // Get cache key from metadata or generate from request
    const cacheKey = this.getCacheKey(context);
    
    // Try to get from cache
    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
      return of(cachedData);
    }

    // Get TTL from metadata or use default
    const ttl = this.reflector.get<number>(
      CACHE_TTL_METADATA,
      context.getHandler(),
    );

    // Cache miss, execute handler and cache result
    return next.handle().pipe(
      tap(async (data) => {
        try {
          await this.cacheService.set(cacheKey, data, ttl);
          this.logger.log(`Cached data for key: ${cacheKey}`);
        } catch (error) {
          this.logger.error(`Failed to cache data for key ${cacheKey}: ${error.message}`);
        }
      }),
    );
  }

  /**
   * Get the cache key for the current request
   * @param context The execution context
   * @returns The cache key
   */
  private getCacheKey(context: ExecutionContext): string {
    // Try to get custom cache key from metadata
    const customCacheKey = this.reflector.get<string>(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );
    
    if (customCacheKey) {
      return customCacheKey;
    }

    // Generate cache key from request
    const request = context.switchToHttp().getRequest<Request>();
    const { originalUrl, query, params } = request;
    
    // Create a stable cache key from URL and query parameters
    const queryString = Object.keys(query).length 
      ? `?${new URLSearchParams(query as Record<string, string>).toString()}`
      : '';
      
    return `${originalUrl}${queryString}`;
  }
}