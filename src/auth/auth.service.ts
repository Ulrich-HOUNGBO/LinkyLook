import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto, LoginResponseDto, RegisterDto } from './dto/auth.dto';
import { UsersRepository } from '../users/models/users.repository';
import { RedisService } from '@app/common';
import { Users } from '../users/models/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (user && user.password) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async register(registerDto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.usersRepository.findOne({
      where: [{ email: registerDto.email }, { username: registerDto.username }],
    });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const userData = new Users(registerDto);
    userData.email = registerDto.email;
    userData.username = registerDto.username;
    userData.password = hashedPassword;
    userData.verified = false;
    // Set other fields as needed

    return await this.usersRepository.create(userData);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.getUser(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Get the stored refresh token from Redis
    const storedRefreshToken = await this.redisService.get(
      `refresh_token:${userId}`,
    );
    console.log('Stored Refresh Token:', storedRefreshToken);

    if (!storedRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // In a real application, you would compare the refresh token with the stored one
    if (storedRefreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    // For enhanced security, you could also implement token rotation

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async googleLogin(user: Users) {
    if (!user) {
      throw new UnauthorizedException('No user from Google');
    }

    // Check if user exists in our database
    const existingUser = await this.usersRepository.findOne({
      where: { email: user.email },
    });

    if (!existingUser) {
      const userData = new Users(user);
      userData.email = user.email;
      userData.username = user.username;
      userData.verified = false;
    } else if (!existingUser.googleId) {
      // Update existing user with Google ID if they don't have one
      existingUser.googleId = user.googleId;
      existingUser.verified = true;
      await this.usersRepository.create(existingUser);
    }

    // Generate tokens
    const tokens: LoginResponseDto = await this.getTokens(
      existingUser!.id,
      existingUser!.email,
    );
    await this.updateRefreshToken(existingUser!.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    // Delete the refresh token from Redis
    await this.redisService.del(`refresh_token:${userId}`);
    return { message: 'Logged out successfully' };
  }

  private async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: parseInt(
            this.configService.get<string>('JWT_EXPIRATION') || '3600',
            10,
          ),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: parseInt(
            this.configService.get<string>('JWT_REFRESH_EXPIRATION') ||
              '259200', // Default to 3 days
            10,
          ),
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    // Store the refresh token in Redis instead of the database
    await this.redisService.set(`refresh_token:${userId}`, refreshToken);
  }
}
