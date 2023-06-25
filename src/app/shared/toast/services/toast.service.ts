import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable()
export class ToastService {
    public constructor(private toastController: ToastController) {}

    public async presentSuccess(
        message: string,
        duration: number
    ): Promise<any> {
        const toastReference = await this.toastController.create({
            message,
            duration,
            position: 'top',
            animated: true,
            cssClass: 'toast-success',
            mode: 'ios',
            buttons: [
                {
                    text: '',
                    icon: 'close-outline',
                    role: 'cancel',
                    handler: () => {},
                },
            ],
        });

        return await toastReference.present();
    }

    public async presentError(message: string, duration: number): Promise<any> {
        const toastReference = await this.toastController.create({
            message,
            duration,
            position: 'top',
            animated: true,
            cssClass: 'toast-error',
            mode: 'ios',
            buttons: [
                {
                    text: '',
                    icon: 'close-outline',
                    role: 'cancel',
                    handler: () => {},
                },
            ],
        });

        return await toastReference.present();
    }
}
