import {
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModalController, IonicModule } from '@ionic/angular';
import { DailyWorkDoc, DateTimeService, SearcheableSelectModel } from '@shared';
import { map, Observable, of, switchMap } from 'rxjs';
import { register, SwiperContainer } from 'swiper/element/bundle';
import { MultiStepFormService } from '../form/services/multi-step-form.service';
import { WorkItemComponent } from '../form/containers/work-item/work-item.component';
import { PacientComponent } from '../form/containers/pacient/pacient.component';
import { DoctorComponent } from '../form/containers/doctor/doctor.component';
import { FormReducer } from '../form/custom-state/reducer/form.reducer';
import { CommonModule } from '@angular/common';
import { LogWorkFacade } from '@abstraction';
import { RxDocument } from 'rxdb';
import { RxLogWorkDocumentType } from '@core';
import { FormSelector } from '../form/custom-state/selector/form.selector';
import { TimeTrackingComponent } from '../form/containers/time-tracking/time-tracking.component';

const initSwiper = () => register();
@Component({
    selector: 'app-swiper',
    templateUrl: './swiper.component.html',
    styleUrls: ['./swiper.component.scss'],
    providers: [MultiStepFormService],
    standalone: true,
    imports: [
        IonicModule,
        DoctorComponent,
        PacientComponent,
        WorkItemComponent,
        CommonModule,
        TimeTrackingComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SwiperComponent implements OnInit, OnDestroy {
    @Input() public chosenDate: string;
    @ViewChild('swiperContainer') swiperContainer: ElementRef | undefined;

    public multiForm: Observable<FormGroup>;
    public swiperPageTwoComponent: 'app-pacient' | 'app-time-tracking' = null;
    private swiperElement: any;

    constructor(
        private modalController: ModalController,
        private formService: MultiStepFormService,
        private formStore: FormReducer,
        private logWorkFacade: LogWorkFacade,
        private readonly dateTimeService: DateTimeService,
        private formSelectors: FormSelector
    ) {
        initSwiper();
    }
    ngOnInit() {
        this.swiperElement = document.querySelector(
            'swiper-container'
        ) as SwiperContainer;
        // buttonEl.addEventListener('click', () => {
        //     // swiperEl.swiper.slideNext();
        //     console.log('swiperEl: ', swiperEl.swiper);
        //     // swiperEl.swiper.watchOverflow = true;
        // });

        this.swiperElement.allowSlideNext = false;
        // swiperEl.allowSlidePrev = false;

        const dailyWorkId = this.dateTimeService.getDailyWorkId(
            new Date(this.chosenDate)
        );
        this.multiForm = this.logWorkFacade.getOne$({ id: dailyWorkId }).pipe(
            map(
                (dailyWork: DailyWorkDoc) =>
                    dailyWork as RxDocument<RxLogWorkDocumentType>
            ),
            switchMap((dailyWork) =>
                of(this.formService.initMultiStepForm(dailyWork))
            )
        );
    }

    public onSlideChange() {}

    public onDoctorSelected(event: {
        value: SearcheableSelectModel;
        formIndex: number;
    }) {
        if (event.value && event.value.value !== '') {
            this.swiperElement.allowSlideNext = true;
            this.swiperElement.swiper.slideNext();
            this.swiperElement.allowSlideNext = false;
        }
    }

    public onGoToDoctor(index: number) {
        this.swiperPageTwoComponent = 'app-pacient';
        this.formStore.setCurrentPacient(0);
        this.swiperElement.allowSlideNext = true;
        this.swiperElement.swiper.slideNext();
        this.swiperElement.allowSlideNext = false;
    }

    public onGoToWorkItem() {
        this.swiperElement.allowSlideNext = true;
        this.swiperElement.swiper.slideNext();
        this.swiperElement.allowSlideNext = false;
    }

    public onNavigateTimeTracking() {
        this.swiperPageTwoComponent = 'app-time-tracking';
        this.swiperElement.allowSlideNext = true;
        this.swiperElement.swiper.slideNext();
        this.swiperElement.allowSlideNext = false;
    }

    public ngOnDestroy() {
        this.formStore.setCurrentPacient(0);
        this.formStore.setCurrentDoctor(0);
        this.swiperPageTwoComponent = null;
    }

    public closeModal() {
        this.modalController.dismiss();
    }

    public async save() {
        this.formStore.setCurrentPacient(0);
        this.formStore.setCurrentDoctor(0);

        const isFormValid = this.formService.getForm().valid;
        const formValue = this.formService.getForm().value;

        // return await this.modalController.dismiss({
        //     formValue,
        // });

        return await this.modalController.dismiss({
            formValue,
            dismissed: isFormValid,
        });
    }
}
