import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { Users } from './models/users.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return await this.usersService.getUser(id);
  }

  @Get('profile')
  async getProfile(@ActiveUser() user: Users) {
    return await this.usersService.getUser(user.id);
  }

  @Patch(':id/update')
  async updateUser(id: string, data: Partial<any>) {
    return await this.usersService.updateUser(id, data);
  }

  @Delete('')
  async deleteUser(id: string) {
    return await this.usersService.deleteUser(id);
  }
}
