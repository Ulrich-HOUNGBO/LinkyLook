import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { join } from 'path';
import { createPostgresConfig } from './postgres.config';

const configService = new ConfigService();
const postgresConfig = createPostgresConfig(configService);

export default new DataSource({
  ...postgresConfig,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [
    join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      'migrations',
      '*.{ts,js}',
    ),
  ],
  migrationsTableName: 'typeorm_migrations',
  logging: true,
});
