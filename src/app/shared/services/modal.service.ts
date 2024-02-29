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
        backdropDismiss: boolean,
        canDismissFn?: () => Promise<boolean>
    ): Promise<void> {
        this.modal = await this.modalController.create({
            component: componentRef,
            cssClass,
            initialBreakpoint: 0.9,
            breakpoints: [0, 0.5, 0.9],
            componentProps,
            backdropDismiss,
            canDismiss: canDismissFn,
        });

        await this.modal.present();
    }

    public async onDidDismiss(): Promise<OverlayEventDetail<any>> {
        return await this.modal.onDidDismiss();
    }
}
