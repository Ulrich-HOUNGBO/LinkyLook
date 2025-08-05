import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ResponseInterceptor } from '@app/common/response/response.interceptor';
import { CacheInterceptor, CacheService } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { RedocModule, RedocOptions } from 'nestjs-redoc';
import { GlobalAuthGuard } from './auth/guards/global-auth.guard';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const reflector = app.get(Reflector);
  const cacheService = app.get(CacheService);
  app.enableCors();
  app.use(helmet());
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalInterceptors(new CacheInterceptor(cacheService, reflector));
  app.useGlobalGuards(new GlobalAuthGuard(reflector));

  const config = new DocumentBuilder()
    .setTitle('LinkyLook API')
    .setDescription('LinkyLook API Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .setContact(
      'LinkyLook Team',
      'mailto:admin@linkylook.com',
      'admin@linkylook.com',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      url: '/docs-json',
    },
  };
  SwaggerModule.setup('', app, document, customOptions);

  // Setup ReDoc
  const redocOptions: RedocOptions = {
    redocVersion: 'latest',
    title: 'LinkyLook API Documentation',
    sortPropsAlphabetically: true,
    hideDownloadButton: true,
    hideHostname: true,
  };
  await RedocModule.setup('/docs', app, document, redocOptions);
  const configService = app.get(ConfigService);

  await app.listen(configService.get<number>('PORT') ?? 3000);
}
bootstrap();
