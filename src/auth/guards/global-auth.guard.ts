import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class GlobalAuthGuard implements CanActivate {
  private readonly jwtAuthGuard: JwtAuthGuard;

  constructor(private readonly reflector: Reflector) {
    this.jwtAuthGuard = new JwtAuthGuard();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is public (has IS_PUBLIC_KEY metadata)
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If the route is public, allow access
    if (isPublic) {
      return true;
    }

    // Otherwise, use the JWT guard
    return this.jwtAuthGuard.canActivate(context) as Promise<boolean>;
  }
}
