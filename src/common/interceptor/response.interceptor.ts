import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ResponseHttpItf } from '../interface';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseHttpItf<any>> {
    return next.handle().pipe(
      map(data => {
        return {
          // message: 'success',
          data,
          ok: true,
        };
      }),
    );
  }
}
