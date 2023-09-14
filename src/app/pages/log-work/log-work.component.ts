import { Component, OnInit } from '@angular/core';
import { DailyWork, DateTimeService, ModalService } from '@shared';
import { SwiperComponent } from './swiper/swiper.component';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { LogWorkApiServce, LogWorkFacade } from '@abstraction';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-log-work',
    templateUrl: './log-work.component.html',
    styleUrls: ['./log-work.component.scss'],
    standalone: true,
    imports: [HeaderComponent, IonicModule],
    providers: [],
})
export class LogWorkComponent implements OnInit {
    constructor(
        private modalService: ModalService,
        private logWorkFacade: LogWorkFacade,
        private dailyWorkIdService: DateTimeService,
        private logWorkApiService: LogWorkApiServce
    ) {}

    ngOnInit() {}

    public async selectDate(event: any) {
        await this.modalService.createAndShow(
            SwiperComponent,
            '',
            {
                chosenDate: event.detail.value,
            },
            true
        );

        const modalData = await this.modalService.onDidDismiss();

        // console.log('GSB SAVE: ', modalData.data.dismissed);
        // console.log('GSB SAVE: ', modalData.data.formValue);

        const docId = this.dailyWorkIdService.getDailyWorkId(
            new Date(event.detail.value)
        );
        if (modalData.data && modalData.data.dismissed) {
            const dailyWork: DailyWork = {...modalData.data.formValue, id: docId};
            const apiDoc = await firstValueFrom(
                this.logWorkApiService.createDailyWork(dailyWork)
            );

            await this.logWorkFacade.editOne({
                dailyWork: modalData.data.formValue,
                dailyId: docId,
                // eslint-disable-next-line no-underscore-dangle
                mongoId: apiDoc._id,
            });
        }
    }
}
