import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { IonicModule, LoadingController, NavController } from '@ionic/angular';
import { Keyboard } from '@capacitor/keyboard';
import { firstValueFrom } from 'rxjs';
import { LoginModel } from '@shared';
import { AuthFacade } from '@abstraction';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-log-in',
    templateUrl: './log-in.page.html',
    styleUrls: ['./log-in.page.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
    providers: [AuthFacade],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LogInPage implements OnInit {
    public form: FormGroup;

    constructor(
        private navCtrl: NavController,
        private authFacade: AuthFacade,
        private loadingController: LoadingController
    ) {}

    ngOnInit() {
        this.createForm();
    }

    createForm() {
        this.form = new FormGroup({
            email: new FormControl(null, {
                validators: [
                    Validators.required,
                    Validators.email,
                    Validators.minLength(4),
                ],
            }),
            password: new FormControl(null, {
                validators: [Validators.required, Validators.minLength(4)],
            }),
        });
    }

    async goBack(): Promise<boolean> {
        return await this.navCtrl.navigateBack('/home');
    }

    async forgotPassword(): Promise<boolean> {
        return await this.navCtrl.navigateForward('log-in/password-recovery');
    }

    closeKeyboard() {
        Keyboard.hide();
    }

    async logIn(): Promise<void> {
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
        } catch (error) {
            await loader.dismiss();
        }
    }
}
