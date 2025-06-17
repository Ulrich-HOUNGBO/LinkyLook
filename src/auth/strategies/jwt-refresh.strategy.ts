import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';
import { TokenPayloadDto } from '../dto/auth.dto';
import { RedisService } from '@app/common';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  async validate(req: Request, payload: TokenPayloadDto) {
    const refreshToken = req.headers.authorization!.split(' ')[1];
    const user = await this.usersService.getUser(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Get the stored refresh token from Redis
    const storedRefreshToken = await this.redisService.get(`refresh_token:${payload.sub}`);

    if (!storedRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // In a real application, you would compare the refresh token with the stored one
    // For enhanced security, you could also implement token rotation
    return { ...user, refreshToken };
  }
}
