import { Component, OnInit } from '@angular/core';
import { ModalService } from '@shared';
import { RxCollection, RxDatabase } from 'rxdb';
import { RxDatabaseProvider } from 'src/app/database/rx-database.provider';
import { FormModalComponent } from './form/form-modal/form-modal.component';
import { SwiperComponent } from './swiper/swiper.component';

@Component({
    selector: 'app-log-work',
    templateUrl: './log-work.component.html',
    styleUrls: ['./log-work.component.scss'],
})
export class LogWorkComponent implements OnInit {
    constructor(
        private modalService: ModalService,
        private databaseProvider: RxDatabaseProvider
    ) {}

    ngOnInit() {}

    public async selectDate(event: any) {
        console.log('Open Form Event: ', event);
        await this.modalService.createAndShow(
            SwiperComponent,
            '',
            {
                formValue: event.detail.value,
            },
            true
        );

        const modalData = await this.modalService.onDidDismiss();

        console.log('GSB modal data: ', modalData);

        if (modalData.data && modalData.data.dismissed) {
            // eslint-disable-next-line @typescript-eslint/dot-notation
            const x = this.databaseProvider?.rxDatabaseInstance[
                // eslint-disable-next-line @typescript-eslint/dot-notation
                'logwork'
            ] as RxCollection;

            // x.insert(modalData.data.formValue);

            // eslint-disable-next-line @typescript-eslint/dot-notation
            await x.insert(modalData.data.formValue);
        }
    }
}
