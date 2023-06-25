import { Injectable } from '@angular/core';
import { AuthService } from '@core';
import { AuthenticationResult, LoginModel } from '@shared';
import { Observable } from 'rxjs';

@Injectable()
export class AuthFacade {
    constructor(private readonly authService: AuthService) {}

    public isAuthenticated(): boolean {
        return this.authService.isAuthenticated();
    }

    public async logoutWithConfirmation(): Promise<void> {
        return await this.authService.logoutWithConfirmation();
    }

    public async logout(): Promise<void> {
        return await this.authService.logout();
    }

    public login(loginModel: LoginModel): Observable<AuthenticationResult> {
        return this.authService.login(loginModel);
    }
}
