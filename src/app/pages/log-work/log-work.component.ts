import { Component, OnInit } from '@angular/core';
import { ModalService } from '@shared';
import { FormModalComponent } from './form/form-modal/form-modal.component';

@Component({
    selector: 'app-log-work',
    templateUrl: './log-work.component.html',
    styleUrls: ['./log-work.component.scss'],
})
export class LogWorkComponent implements OnInit {
    constructor(private modalService: ModalService) {}

    ngOnInit() {}

    public async selectDate(event: any) {
        console.log('Open Form Event: ', event);
        await this.modalService.createAndShow(
            FormModalComponent,
            '',
            {
                formValue: event.detail.value,
            },
            true
        );

        const modalData = await this.modalService.onDidDismiss();

        console.log('GSB modal data: ', modalData);
    }
}
