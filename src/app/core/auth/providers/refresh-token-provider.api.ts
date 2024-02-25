import { Injectable } from '@angular/core';
import { AuthenticationResult } from '@shared';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError, map } from 'rxjs/operators';
import { ApiErrorCodes, HttpService } from '../../api';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class RefreshTokenProvider {
    private path = 'auth';
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private AUTH_KEY = 'AUTH_KEY';

    constructor(private httpService: HttpService) {}

    public refreshToken(
        authenticationResult: AuthenticationResult
    ): Observable<string> {
        if (!authenticationResult || !authenticationResult.refreshToken) {
            return throwError(
                () =>
                    new HttpErrorResponse({
                        error: {
                            message: ApiErrorCodes.expiredRefreshToken,
                            errorName: ApiErrorCodes.expiredRefreshToken,
                        },
                        status: 401,
                        statusText: 'Unauthorized',
                    })
            );
        }
        // add refresh token to bearer authentication header
        return this.httpService
            .makePost<AuthenticationResult, AuthenticationResult>(
                `${this.path}/refresh`,
                authenticationResult,
                'json',
                {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    Authorization: `Bearer ${authenticationResult.refreshToken}`,
                }
            )
            .pipe(
                map((tokenAndRefreshToken: AuthenticationResult) => {
                    localStorage.setItem(
                        this.AUTH_KEY,
                        JSON.stringify(
                            new AuthenticationResult(
                                tokenAndRefreshToken.accessToken,
                                tokenAndRefreshToken.refreshToken
                            )
                        )
                    );

                    return tokenAndRefreshToken.accessToken;
                }),
                catchError((error) => {
                    localStorage.removeItem(this.AUTH_KEY);
                    return throwError(() => new Error(error));
                })
            );
    }
}
