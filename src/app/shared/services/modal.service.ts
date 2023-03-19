import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';

@Injectable()
export class ModalService {
    private modal: HTMLIonModalElement;

    public constructor(private modalController: ModalController) {}

    public async createAndShow(
        componentRef: any,
        cssClass: string,
        componentProps: any,
        backdropDismiss: boolean
    ): Promise<void> {
        this.modal = await this.modalController.create({
            component: componentRef,
            cssClass,
            componentProps,
            backdropDismiss,
			breakpoints: [0, 0.5, 0.8],
			initialBreakpoint: 0.8,
        });

        await this.modal.present();
    }

    public async onDidDismiss(): Promise<OverlayEventDetail<any>> {
        return this.modal.onDidDismiss();
    }
}
