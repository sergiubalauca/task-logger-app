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
import { LoginModel, RegisterModel, UserStorageService } from '@shared';
import { AuthFacade } from '@abstraction';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

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
    providers: [AuthFacade, UserStorageService, InAppBrowser],
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
    private inAppBrowser: InAppBrowser = inject(InAppBrowser);

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

    protected openTaCSite() {
        const browser = this.inAppBrowser.create(
            'https://sergiubalauca.github.io/dentalog-t-c/',
            '_blank',
            'presentationstyle=formsheet,toolbarposition=top,fullscreen=no,hideurlbar=yes,toolbarcolor=#176bff,closebuttoncolor=#ffffff,navigationbuttoncolor=#ffffff'
        );

        browser.show();
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
                ],
            ],
            password: ['', [Validators.required]],
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
            ],
            password: [
                {
                    type: 'required',
                    message: this.translate.instant(
                        'login-page.errorMessages.password.required'
                    ),
                },
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
