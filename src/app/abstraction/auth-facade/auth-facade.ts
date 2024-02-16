import { Injectable } from '@angular/core';
import { AuthService } from '@core';
import {
    AuthenticationResult,
    LoginModel,
    LogOutModel,
    RegisterModel,
} from '@shared';
import { Observable } from 'rxjs';

@Injectable()
export class AuthFacade {
    constructor(private readonly authService: AuthService) {}

    public isAuthenticated(): boolean {
        return this.authService.isAuthenticated();
    }

    public async logoutWithConfirmation(
        loginModel: LogOutModel
    ): Promise<void> {
        return await this.authService.logoutWithConfirmation(loginModel);
    }

    public async logout(loginModel: LogOutModel): Promise<void> {
        return await this.authService.logout(loginModel);
    }

    public login(loginModel: LoginModel): Observable<AuthenticationResult> {
        return this.authService.login(loginModel);
    }

    public register(registerModel: RegisterModel): Observable<any> {
        return this.authService.register(registerModel);
    }

    public async deleteAccount(logOutModel: LogOutModel): Promise<any> {
        return await this.authService.deleteAccount(logOutModel);
    }
}
