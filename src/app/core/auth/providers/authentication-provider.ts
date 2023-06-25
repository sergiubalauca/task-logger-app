import { Injectable } from '@angular/core';
import { AuthenticationResult } from '@shared';
import { BehaviorSubject } from 'rxjs';
import { TokenProvider } from './token-provider';

@Injectable()
export class AuthenticationTokenProvider extends TokenProvider {
    private readonly authKey = 'AUTH_KEY';

    private tokenSubject = new BehaviorSubject<AuthenticationResult | null>(
        this.getToken()
    );
    // eslint-disable-next-line @typescript-eslint/member-ordering
    public tokenChanged$ = this.tokenSubject.asObservable();

    public removeToken(): void {
        localStorage.removeItem(this.authKey);
        this.tokenSubject.next(null);
    }

    public getToken(): AuthenticationResult {
        return JSON.parse(localStorage.getItem(this.authKey));
    }

    public saveToken(result: AuthenticationResult) {
        const authenticationResult = new AuthenticationResult(
            result.accessToken,
            result.refreshToken
        );
        localStorage.setItem(
            this.authKey,
            JSON.stringify(authenticationResult)
        );
        this.tokenSubject.next(authenticationResult);
    }
}
