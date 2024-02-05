import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import { IonicModule, LoadingController, NavController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { LoginModel, UserStorageService } from '@shared';
import { AuthFacade, SyncConfigurationService } from '@abstraction';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-log-in',
    templateUrl: './log-in.page.html',
    styleUrls: ['./log-in.page.scss'],
    standalone: true,
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
    ],
    providers: [AuthFacade, UserStorageService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LogInPage implements OnInit {
    public form: FormGroup;
    public formValidationMessages = { email: [], password: [] };
    public showPassword = false;
    public togglePassButtonLabel = this.translate.instant(
        'login-page.show-password'
    );
    public labels = {
        email: this.translate.instant('login-page.email'),
        password: this.translate.instant('login-page.password'),
    };

    constructor(
        private navCtrl: NavController,
        private authFacade: AuthFacade,
        private loadingController: LoadingController,
        private formBuilder: FormBuilder,
        private readonly translate: TranslateService,
        private readonly userStorageService: UserStorageService,
        private syncConfigurationService: SyncConfigurationService
    ) {}

    ngOnInit() {
        this.initLogin();
    }

    public async logIn(): Promise<void> {
        if (this.form.invalid) {
            return;
        }

        const loader = await this.loadingController.create();
        const loginModel: LoginModel = this.form.value;
        await loader.present();

        try {
            const authRes = await firstValueFrom(
                this.authFacade.login(loginModel)
            );
            if (authRes) {
                await this.navCtrl.navigateRoot('home');
                await loader.dismiss();
            }
            this.syncConfigurationService.startSync();
        } catch (error) {
            await loader.dismiss();
        }
    }

    public togglePassword() {
        this.showPassword = !this.showPassword;
        this.togglePassButtonLabel = this.showPassword
            ? this.translate.instant('login-page.hide-password')
            : this.translate.instant('login-page.show-password');
    }

    public register() {
        this.navCtrl.navigateForward('register');
    }

    private initLogin() {
        this.form = this.formBuilder.group({
            email: [
                this.userStorageService.getUsername(),
                [
                    Validators.required,
                    Validators.minLength(5),
                    this.noWhitespaceValidator,
                ],
            ],
            password: ['', [Validators.required]],
        });

        this.formValidationMessages = {
            email: [
                {
                    type: 'required',
                    message: this.translate.instant(
                        'login-page.errorMessages.email.required'
                    ),
                },
                {
                    type: 'minlength',
                    message: this.translate.instant(
                        'login-page.errorMessages.email.minlength'
                    ),
                },
                {
                    type: 'whitespace',
                    message: this.translate.instant(
                        'login-page.errorMessages.email.whitespace'
                    ),
                },
            ],
            password: [
                {
                    type: 'required',
                    message: this.translate.instant(
                        'login-page.errorMessages.password.required'
                    ),
                },
                {
                    type: 'minlength',
                    message: this.translate.instant(
                        'login-page.errorMessages.password.minlength'
                    ),
                }
            ],
        };
    }

    private noWhitespaceValidator(
        control: FormControl
    ): ValidationErrors | null {
        if ((control.value || '').indexOf(' ') >= 0) {
            return { whitespace: true };
        }

        return null;
    }
}
