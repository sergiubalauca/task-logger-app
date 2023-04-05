import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DoCheck,
    ElementRef,
    OnInit,
    ViewChild,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { register } from 'swiper/element/bundle';
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
    @ViewChild('swiperContainer') swiperContainer: ElementRef | undefined;

    public doctorFormGroupControls: AbstractControl[];
    public doctorFormGroup: FormGroup;

    public multiForm: FormGroup;
    constructor(
        private multiStepFormService: MultiStepFormService,
        private cdr: ChangeDetectorRef
    ) {
        initSwiper();
    }
    ngOnInit() {
        this.multiForm = this.multiStepFormService.initMultiStepForm();
        this.doctorFormGroupControls =
            this.multiStepFormService.getDoctorFormGroupControls();
        this.doctorFormGroup = this.multiStepFormService.getDoctorFormGroup();

        this.doctorFormGroupControls.push(
            this.multiStepFormService.createNewDoctorControl()
        );

        this.multiForm.valueChanges.subscribe((value) => {
            console.log('multiForm valueChanges: ', value);
        });
    }

    public onSlideChange() {
        console.log('multiForm: ', this.multiForm);
        console.log('doctorFormGroupControls: ', this.doctorFormGroupControls);
        console.log('doctorFormGroup: ', this.doctorFormGroup);
    }

    public addDoctorControl() {
        this.doctorFormGroupControls.push(
            this.multiStepFormService.createNewDoctorControl()
        );
    }

    public removeDoctorControl(index: number) {
        this.doctorFormGroupControls.splice(index, 1);
    }

    public onDoctorSelected(event: any) {
        console.log('onDoctorSelected: ', event);
    }
}
