import { Injectable, NestInterceptor, ExecutionContext, CallHandler, UnauthorizedException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable()
export class TokenInterceptor implements NestInterceptor {
    constructor(private readonly authService: AuthService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];

        console.log('TokenInterceptor');

        if (!token) {
            throw new UnauthorizedException('Token missing');
        }

        return this.authService.validateToken(token).pipe(
            switchMap((decodedToken) => {
                if (this.authService.isTokenExpired(decodedToken) && this.authService.isWithinGracePeriod(decodedToken)) {
                    return this.authService.renewToken(decodedToken.userId).pipe(
                        switchMap((newToken) => {
                            request.headers.authorization = `Bearer ${newToken}`;
                            return next.handle();
                        }),
                    );
                } else if (this.authService.isTokenExpired(decodedToken)) {
                    throw new UnauthorizedException('Token expirado y fuera del periodo de gracia');
                } else {
                    return next.handle();
                }
            }),
            catchError((err) => throwError(() => new UnauthorizedException(err.message))),
        );
    }
}
