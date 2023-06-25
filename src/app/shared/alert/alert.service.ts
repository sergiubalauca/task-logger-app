import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable()
export class AlertService {
    constructor(private alertController: AlertController) {}

    public async presentAlert(
        header: string,
        message: string,
        buttons: any[],
        isBackDropDismiss?: boolean
    ): Promise<any> {
        const alertReference = await this.alertController.create({
            header,
            message,
            buttons,
            cssClass: ['custom-alert'],
            backdropDismiss: isBackDropDismiss,
        });

        return await alertReference.present();
    }
}
