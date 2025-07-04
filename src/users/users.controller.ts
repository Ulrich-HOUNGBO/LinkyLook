import {
  Body,
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
import { SkipCache } from '@app/common';
import { ChangePasswordDto } from './dto/users.dto';

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

  @SkipCache()
  @Get('me')
  getProfile(@ActiveUser() user: Users) {
    console.log('User profile:', user);
    return user;
  }

  @SkipCache()
  @Patch('change-password')
  async changePassword(
    @ActiveUser() user: Users,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.usersService.changePassword(user.id, changePasswordDto);
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return await this.usersService.getUser(id);
  }

  @Patch(':id/update')
  async updateUser(id: string, data: Partial<Users>) {
    return await this.usersService.updateUser(id, data);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.deleteUser(id);
  }
}
