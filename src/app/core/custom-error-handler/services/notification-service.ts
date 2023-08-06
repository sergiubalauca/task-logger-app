import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable()
export class NotificationService {
    constructor(public alertController: ToastController) {}

    async showSuccess(message: string): Promise<void> {
        const toast = await this.alertController.create({
            header: 'Success',
            message,
            buttons: ['OK'],
        });

        await toast.present();
    }

    async showError(message: string): Promise<void> {
        const alert = await this.alertController.create({
            header: 'Error',
            message,
            buttons: ['OK'],
        });

        await alert.present();
    }
}
