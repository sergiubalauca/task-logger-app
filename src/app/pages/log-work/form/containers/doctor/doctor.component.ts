import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SearcheableSelectModel } from '@shared';
import { map, Observable, of, switchMap } from 'rxjs';
import { FormSwipeStateService, MultiStepFormService } from '../../services';

@Component({
    selector: 'app-doctor',
    templateUrl: './doctor.component.html',
    styleUrls: ['./doctor.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorComponent implements OnInit {
    // @Input() public multiForm: FormGroup;
    @Input() public chosenDate: string;

    @Output() doctorSelected: EventEmitter<{
        value: SearcheableSelectModel;
        formIndex: number;
    }> = new EventEmitter<null>();
    @Output() goToDoctor: EventEmitter<number> = new EventEmitter<number>();

    public doctorGroupControls: Observable<{
        form: FormGroup;
        doctorFormGroup: FormGroup;
        doctorFormGroupControls: AbstractControl[];
        timeGroup: FormGroup;
    }> = of({
        form: this.multiStepFormService.initMultiStepForm(),
        doctorFormGroup: this.multiStepFormService.getDoctorFormGroup(),
        doctorFormGroupControls:
            this.multiStepFormService.getDoctorFormGroupControls(),
        timeGroup: this.multiStepFormService.getTimeFormGroup(),
    });

    constructor(
        private formSwipeState: FormSwipeStateService,
        private multiStepFormService: MultiStepFormService
    ) {}

    ngOnInit() {
        this.multiStepFormService.addDoctorControl();
        // this.doctorGroupControls = of({
        //     form: this.multiStepFormService.initMultiStepForm(),
        //     doctorFormGroup: this.multiStepFormService.getDoctorFormGroup(),
        //     doctorFormGroupControls:
        //         this.multiStepFormService.getDoctorFormGroupControls(),
        //     timeGroup: this.multiStepFormService.getTimeFormGroup(),
        // });
    }

    public addDoctorControl() {
        this.formSwipeState.setCurrentPacient(0);
        this.multiStepFormService.addDoctorControl();

        // this.doctorGroupControls = of({
        //     form: this.multiStepFormService.initMultiStepForm(),
        //     doctorFormGroup: this.multiStepFormService.getDoctorFormGroup(),
        //     doctorFormGroupControls:
        //         this.multiStepFormService.getDoctorFormGroupControls(),
        //     timeGroup: this.multiStepFormService.getTimeFormGroup(),
        // });
    }

    public removeDoctorControl(index: number): void {
        this.formSwipeState.setCurrentDoctor(0);
        this.formSwipeState.setCurrentPacient(0);
        this.multiStepFormService.removeDoctorControl(index);
        // this.doctorGroupControls = this.doctorGroupControls.pipe(
        //     map((dgc) => ({
        //         ...dgc,
        //         doctorFormGroup: this.multiStepFormService.getDoctorFormGroup(),
        //         doctorFormGroupControls:
        //             this.multiStepFormService.getDoctorFormGroupControls(),
        //         timeGroup: this.multiStepFormService.getTimeFormGroup(),
        //     }))
        // );
    }

    public onDoctorSelected(
        event: SearcheableSelectModel,
        formIndex: number
    ): void {
        if (event.value && event.value !== '') {
            this.formSwipeState.setCurrentDoctor(formIndex);
            this.doctorSelected.emit({ value: event, formIndex });
        }
    }

    public onGoToDoctor(index: number): void {
        this.formSwipeState.setCurrentDoctor(index);

        this.goToDoctor.emit(index);
    }
}
