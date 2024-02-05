import {
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    inject,
    OnInit,
} from '@angular/core';
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
import { RegisterModel, UserStorageService } from '@shared';
import { AuthFacade } from '@abstraction';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Browser } from '@capacitor/browser';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
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
export class RegisterPage implements OnInit {
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
        private readonly userStorageService: UserStorageService
    ) {}

    ngOnInit() {
        this.initLogin();
    }

    protected async openTaCSite(): Promise<void> {
        await Browser.open({
            url: 'https://sergiubalauca.github.io/dentalog-t-c/',
        });
    }

    public async register(): Promise<void> {
        if (this.form.invalid) {
            return;
        }

        const loader = await this.loadingController.create();
        const username = this.form.value.email.split('@')[0];
        const registerModel: RegisterModel = { ...this.form.value, username };
        await loader.present();

        try {
            const authRes = await firstValueFrom(
                this.authFacade.register(registerModel)
            );
            if (authRes) {
                await this.navCtrl.navigateRoot('home');
                await loader.dismiss();
            }
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

    public goBack() {
        this.navCtrl.navigateRoot('login');
    }

    private initLogin() {
        this.form = this.formBuilder.group({
            email: [
                this.userStorageService.getUsername(),
                [
                    Validators.required,
                    Validators.minLength(5),
                    this.noWhitespaceValidator,
                    Validators.pattern(
                        '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'
                    ),
                ],
            ],
            password: ['', [Validators.required, Validators.minLength(4)]],
            termsAndConditions: [false, [Validators.requiredTrue]],
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
                {
                    type: 'pattern',
                    message: this.translate.instant(
                        'login-page.errorMessages.email.pattern'
                    ),
                }
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
