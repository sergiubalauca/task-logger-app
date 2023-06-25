import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map, tap } from 'rxjs/operators';
import { AuthenticationTokenProvider } from '../providers';
import { NavController, LoadingController } from '@ionic/angular';
import { UserStorageService } from './user-storage.service';
import { HttpService } from '../../api';
import { AlertService, AuthenticationResult, LoginModel } from '@shared';

@Injectable()
export class AuthService {
    public isAuthenticated$ = this.tokenProvider.tokenChanged$.pipe(
        map((auth) => auth !== null)
    );
    private authenticateEndpoint = 'auth';

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

    public async logoutWithConfirmation() {
        const yesButton = {
            text: 'Yes',
            handler: async () => {
                const loader = await this.loadingController.create();
                await loader.present();
                await this.logout();
                loader.dismiss();
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

    public async logout() {
        this.tokenProvider.removeToken();
        this.navController.navigateRoot('login');
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
}
