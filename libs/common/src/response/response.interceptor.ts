import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Request, Response } from 'express';
import { instanceToPlain } from 'class-transformer';

interface ErrorResponse {
  message?: string | string[];
  error?: string;
  [key: string]: unknown;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    const { method, url } = ctx.switchToHttp().getRequest<Request>();
    const res = ctx.switchToHttp().getResponse<Response>();
    const start = Date.now();

    return next.handle().pipe(
      map((data: T) => {
        this.logger.log(
          `Response : ${method} ${url} - ${Date.now() - start}ms`,
        );
        const serializedData = instanceToPlain(data);
        return {
          statusCode: res.statusCode,
          timestamp: new Date().toISOString(),
          data: serializedData,
        };
      }),
      catchError((err: Error | HttpException) => {
        this.logger.error(
          `Error: ${method} ${url} – ${Date.now() - start}ms – ${err.message}`,
        );

        const status =
          err instanceof HttpException
            ? err.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        const errorResponse =
          err instanceof HttpException ? err.getResponse() : null;

        const message =
          errorResponse &&
          typeof errorResponse === 'object' &&
          'message' in errorResponse
            ? (errorResponse as ErrorResponse).message
            : err.message;

        const error =
          errorResponse &&
          typeof errorResponse === 'object' &&
          'error' in errorResponse
            ? (errorResponse as ErrorResponse).error
            : 'Internal Server Error';

        throw new HttpException(
          {
            statusCode: status,
            timestamp: new Date().toISOString(),
            error,
            message,
          },
          status,
        );
      }),
    );
  }
}
