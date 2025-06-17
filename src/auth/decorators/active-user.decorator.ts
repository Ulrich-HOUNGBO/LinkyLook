import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Users } from '../../users/models/users.entity';

export const getCurrentUserByContext = (context: ExecutionContext): Users => {
  const request = context
    .switchToHttp()
    .getRequest<Request & { user?: Users }>();

  if (!request.user) {
    throw new Error('User not found in request');
  }

  return request.user;
};

export const ActiveUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): Users => {
    return getCurrentUserByContext(context);
  },
);
