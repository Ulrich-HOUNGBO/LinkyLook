import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Users } from './models/users.entity';
import { DatabaseModule } from '@app/common/database/postgresql';
import { UsersRepository } from './models/users.repository';
import { LoggerModule } from '@app/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule,
    LoggerModule,
    DatabaseModule,
    DatabaseModule.forFeature([Users]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
