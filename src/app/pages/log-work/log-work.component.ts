import { Component, OnInit } from '@angular/core';
import { ModalService } from '@shared';
import { RxCollection, RxDatabase } from 'rxdb';
import { RxDatabaseProvider } from 'src/app/database/rx-database.provider';
import { SwiperComponent } from './swiper/swiper.component';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { LogWorkRepository } from 'src/app/database/repositories/logwork.repository';

@Component({
    selector: 'app-log-work',
    templateUrl: './log-work.component.html',
    styleUrls: ['./log-work.component.scss'],
    standalone: true,
    imports: [HeaderComponent, IonicModule],
    providers: [LogWorkRepository],
})
export class LogWorkComponent implements OnInit {
    constructor(
        private modalService: ModalService,
        private databaseProvider: RxDatabaseProvider,
        private logWorkRepository: LogWorkRepository
    ) {}

    ngOnInit() {}

    public async selectDate(event: any) {
        console.log('Open Form Event: ', event);
        await this.modalService.createAndShow(
            SwiperComponent,
            '',
            {
                chosenDate: event.detail.value,
            },
            true
        );

        const modalData = await this.modalService.onDidDismiss();

        console.log('GSB modal data: ', modalData);
        const docId = new Date(event.detail.value).toUTCString();
        if (
            modalData.data
            // && modalData.data.dismissed
        ) {
            this.logWorkRepository.editDailyWork(
                modalData.data.formValue,
                docId
            );
        }
    }
}
