import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './models/users.repository';
import { ChangePasswordDto, CreateUserDto } from './dto/users.dto';
import { Users } from './models/users.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly repository: UsersRepository,
  ) {}

  async getAllUsers() {
    return await this.repository.find({});
  }

  async getUser(id: string): Promise<Users | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async updateUser(id: string, data: Partial<CreateUserDto>) {
    const user = await this.repository.findOne({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, data);
    return await this.repository.create(user);
  }

  async deleteUser(id: string) {
    return await this.repository.delete({ id });
  }

  async softDeleteUser(id: string) {
    return await this.repository.softDelete({ id });
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<Users | null> {
    const user = await this.repository.findOne({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!(await bcrypt.compare(changePasswordDto.oldPassword, user.password))) {
      throw new BadRequestException('Password not match');
    }

    user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
    return await this.repository.update({ id }, user);
  }

  async forgotPassword(email: string) {
    const user = await this.repository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Logic to handle forgot password, e.g., sending reset link
    // This could involve generating a token and sending an email

    return { message: 'Password reset link sent to your email' };
  }

  async createNewPassword(token: string, newPassword: string) {
    const tokenDecoded: Users = await this.jwtService.decode(token);
    const user = await this.repository.findOne({
      where: { id: tokenDecoded.id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    return await this.repository.update(
      {
        id: user.id,
      },
      user,
    );
  }
}
