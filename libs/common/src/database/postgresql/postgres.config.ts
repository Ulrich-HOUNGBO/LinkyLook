import { ConfigService } from '@nestjs/config';

/**
 * Creates a PostgreSQL configuration object based on environment variables
 * This is used by both the NestJS application and TypeORM migrations
 */
export const createPostgresConfig = (configService: ConfigService) => ({
  type: 'postgres' as const,
  host: configService.getOrThrow<string>('DB_HOST'),
  port: configService.getOrThrow<number>('DB_PORT'),
  database: configService.getOrThrow<string>('DB_NAME'),
  username: configService.getOrThrow<string>('DB_USER'),
  password: configService.getOrThrow<string>('DB_PASSWORD'),
  // Application-specific options
  synchronize: configService.get('NODE_ENV') !== 'production',
  autoLoadEntities: true,
  caching: true,
  migrationsRun: configService.get('NODE_ENV') === 'production',
  softDelete: true,
});
