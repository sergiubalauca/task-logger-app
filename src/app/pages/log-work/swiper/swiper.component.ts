import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DoCheck,
    ElementRef,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SearcheableSelectModel } from '@shared';
import { SwiperOptions } from 'swiper';
import { register } from 'swiper/element/bundle';
import { FormSwipeStateService } from '../form/services';
import { MultiStepFormService } from '../form/services/multi-step-form.service';

const initSwiper = () => {
    console.log('initSwiper');
    return register();
};
@Component({
    selector: 'app-swiper',
    templateUrl: './swiper.component.html',
    styleUrls: ['./swiper.component.scss'],
    providers: [MultiStepFormService],
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwiperComponent implements OnInit {
    @Input() public chosenDate: string;
    @ViewChild('swiperContainer') swiperContainer: ElementRef | undefined;

    public doctorFormGroupControls: AbstractControl[];
    public doctorFormGroup: FormGroup;
    public timeGroup: FormGroup;
    public multiForm: FormGroup;
    public patientGroup: FormGroup;

    private swiperElement: any;

    constructor(
        private multiStepFormService: MultiStepFormService,
        private cdr: ChangeDetectorRef,
        private formSwiperState: FormSwipeStateService
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
        this.multiForm = this.multiStepFormService.initMultiStepForm();
        this.multiStepFormService.addDoctorControl();
    }

    public onSlideChange() {}

    public onDoctorSelected(event: {
        value: SearcheableSelectModel;
        formIndex: number;
    }) {
        if (event.value && event.value.value !== '') {
            this.formSwiperState.setCurrentDoctor(event.formIndex);
            this.swiperElement.allowSlideNext = true;
            this.swiperElement.swiper.slideNext();
            this.swiperElement.allowSlideNext = false;
        }
    }

    public onGoToDoctor(index: number) {
        this.swiperElement.allowSlideNext = true;
        this.formSwiperState.setCurrentDoctor(index);
        this.swiperElement.swiper.slideNext();
        this.swiperElement.allowSlideNext = false;
    }
}
