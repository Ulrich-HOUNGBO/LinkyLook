# API Caching System

This module provides a caching system for API responses using Redis.

## Features

- Automatic caching of GET requests
- Custom cache keys
- Custom TTL (Time-To-Live) for cached data
- Ability to skip caching for specific endpoints

## Usage

### Basic Usage

The caching system is applied globally to all GET requests by default. No additional configuration is needed for basic caching.

### Custom Cache Key

```typescript
import { Controller, Get } from '@nestjs/common';
import { CacheKey } from '@app/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @CacheKey('all_users')
  findAll() {
    return this.usersService.findAll();
  }
}
```

### Custom TTL

```typescript
import { Controller, Get } from '@nestjs/common';
import { CacheTTL } from '@app/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @CacheTTL(3600) // Cache for 1 hour (in seconds)
  findAll() {
    return this.usersService.findAll();
  }
}
```

### Skip Caching

```typescript
import { Controller, Get } from '@nestjs/common';
import { SkipCache } from '@app/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @SkipCache()
  findAll() {
    return this.usersService.findAll();
  }
}
```

### Combining Decorators

```typescript
import { Controller, Get } from '@nestjs/common';
import { CacheKey, CacheTTL } from '@app/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @CacheKey('all_users')
  @CacheTTL(3600) // Cache for 1 hour (in seconds)
  findAll() {
    return this.usersService.findAll();
  }
}
```

## Configuration

The caching system uses the following environment variables:

- `REDIS_HOST`: Redis server host
- `REDIS_PORT`: Redis server port
- `REDIS_PASSWORD`: Redis server password (optional)
- `REDIS_DB`: Redis database number (default: 0)
- `REDIS_PREFIX`: Prefix for Redis keys (default: 'linklyst:')
- `REDIS_TTL`: Default TTL for cached data in seconds (default: 604800, which is 7 days)