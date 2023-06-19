import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    DoCheck,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ModalController, IonicModule } from '@ionic/angular';
import { SearcheableSelectModel } from '@shared';
import { Observable, of } from 'rxjs';
import { SwiperOptions } from 'swiper';
import { register } from 'swiper/element/bundle';
import { FormSwipeStateService } from '../form/services';
import { MultiStepFormService } from '../form/services/multi-step-form.service';
import { WorkItemComponent } from '../form/containers/work-item/work-item.component';
import { PacientComponent } from '../form/containers/pacient/pacient.component';
import { DoctorComponent } from '../form/containers/doctor/doctor.component';
import { FormReducer } from '../form/custom-state/reducer/form.reducer';

const initSwiper = () => {
    console.log('initSwiper');
    return register();
};
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
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SwiperComponent implements OnInit, OnDestroy {
    @Input() public chosenDate: string;
    @ViewChild('swiperContainer') swiperContainer: ElementRef | undefined;

    private swiperElement: any;

    constructor(
        private formSwiperState: FormSwipeStateService,
        private modalController: ModalController,
        private formService: MultiStepFormService,
        private formStore: FormReducer
    ) {
        initSwiper();
    }
    ngOnInit() {
        this.swiperElement = document.querySelector(
            'swiper-container'
        ) as SwiperOptions;
        // buttonEl.addEventListener('click', () => {
        //     // swiperEl.swiper.slideNext();
        //     console.log('swiperEl: ', swiperEl.swiper);
        //     // swiperEl.swiper.watchOverflow = true;
        // });

        this.swiperElement.allowSlideNext = false;
        // swiperEl.allowSlidePrev = false;
        // this.multiForm = of(this.multiStepFormService.initMultiStepForm());
        // this.multiStepFormService.addDoctorControl();
    }

    public onSlideChange() {}

    public onDoctorSelected(event: {
        value: SearcheableSelectModel;
        formIndex: number;
    }) {
        // this.formSwiperState.setCurrentPacient(0);
        if (event.value && event.value.value !== '') {
            this.swiperElement.allowSlideNext = true;
            this.swiperElement.swiper.slideNext();
            this.swiperElement.allowSlideNext = false;
        }
    }

    public onGoToDoctor(index: number) {
        // this.formSwiperState.setCurrentPacient(0);
        this.formStore.setCurrentPacient(0);
        this.swiperElement.allowSlideNext = true;
        // this.formSwiperState.setCurrentDoctor(index);
        this.swiperElement.swiper.slideNext();
        this.swiperElement.allowSlideNext = false;
    }

    public onGoToWorkItem() {
        this.swiperElement.allowSlideNext = true;
        this.swiperElement.swiper.slideNext();
        this.swiperElement.allowSlideNext = false;
    }

    public ngOnDestroy() {
        // this.formSwiperState.setCurrentPacient(0);
        // this.formSwiperState.setCurrentDoctor(0);
        this.formStore.setCurrentPacient(0);
        this.formStore.setCurrentDoctor(0);
    }

    public async close() {
        // this.formSwiperState.setCurrentPacient(0);
        // this.formSwiperState.setCurrentDoctor(0);
        this.formStore.setCurrentPacient(0);
        this.formStore.setCurrentDoctor(0);

        const formValue = this.formService.getForm().value;

        return await this.modalController.dismiss({
            formValue,
        });
    }
}
