import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map, tap } from 'rxjs/operators';
import { AuthenticationTokenProvider } from '../providers';
import { NavController, LoadingController } from '@ionic/angular';

import { HttpService } from '../../api';
import {
    AlertService,
    AuthenticationResult,
    LoginModel,
    LogOutModel,
    RegisterModel,
    UserStorageService,
} from '@shared';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
    public isAuthenticated$ = this.tokenProvider.tokenChanged$.pipe(
        map((auth) => auth !== null)
    );
    private readonly authenticateEndpoint = 'auth';
    private readonly registerEndpoint = 'user/register';

    public constructor(
        private httpService: HttpService,
        private tokenProvider: AuthenticationTokenProvider,
        private navController: NavController,
        private userStorageService: UserStorageService,
        private alertService: AlertService,
        private loadingController: LoadingController
    ) {}

    public isAuthenticated(): boolean {
        const authResult: AuthenticationResult = this.tokenProvider.getToken();

        if (!!authResult) {
            return true;
        }

        return false;
    }

    public async logoutWithConfirmation(loginModel: LogOutModel) {
        const yesButton = {
            text: 'Yes',
            handler: async () => {
                const loader = await this.loadingController.create();
                await loader.present();
                await this.logout(loginModel);
                await loader.dismiss();
            },
        };
        const stayButton = {
            text: 'No',
            handler: () => {},
        };

        await this.alertService.presentAlert(
            'Leave',
            'Do you want to log out?',
            [yesButton, stayButton],
            true
        );
    }

    public async logout(loginModel?: LogOutModel) {
        await firstValueFrom(
            this.httpService.makePost(
                `${this.authenticateEndpoint}/logout`,
                loginModel
            )
        );
        this.tokenProvider.removeToken();
        await this.navController.navigateRoot('login');
    }

    public async forceLogout(loginModel?: LogOutModel) {
        await firstValueFrom(
            this.httpService.makePost(
                `${this.authenticateEndpoint}/force-logout`,
                loginModel
            )
        );
        this.tokenProvider.removeToken();
        await this.navController.navigateRoot('login');
    }

    public login(loginModel: LoginModel): Observable<AuthenticationResult> {
        return this.httpService
            .makePost(`${this.authenticateEndpoint}/login`, loginModel)
            .pipe(
                map(
                    (res: { message: string; tokens: AuthenticationResult }) =>
                        res.tokens as AuthenticationResult
                ),
                tap((authenticationResult: AuthenticationResult) => {
                    this.tokenProvider.saveToken(authenticationResult);
                    this.userStorageService.setUsername(loginModel.email);
                })
            );
    }

    public async deleteAccount(loginModel: LogOutModel): Promise<any> {
        const yesButton = {
            text: 'Yes',
            handler: async () => {
                const loader = await this.loadingController.create();
                await loader.present();
                await firstValueFrom(
                    this.httpService.makePost(
                        `${this.authenticateEndpoint}/delete-account`,
                        loginModel
                    )
                );
                await loader.dismiss();
                this.tokenProvider.removeToken();
                await this.navController.navigateRoot('login');
            },
        };
        const stayButton = {
            text: 'No',
            handler: () => {},
        };

        await this.alertService.presentAlert(
            'Account Deletion',
            'Are you sure?',
            [yesButton, stayButton],
            true
        );
    }

    public register(registerModel: RegisterModel): Observable<any> {
        return this.httpService.makePost(
            `${this.registerEndpoint}`,
            registerModel
        );
    }
}
