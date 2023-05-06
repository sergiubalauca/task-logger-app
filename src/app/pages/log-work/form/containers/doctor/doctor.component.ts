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
import { Observable, of, switchMap } from 'rxjs';
import { FormSwipeStateService, MultiStepFormService } from '../../services';

@Component({
    selector: 'app-doctor',
    templateUrl: './doctor.component.html',
    styleUrls: ['./doctor.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorComponent implements OnInit {
    @Input() public multiForm: FormGroup;
    @Input() public chosenDate: string;

    @Output() doctorSelected: EventEmitter<{
        value: SearcheableSelectModel;
        formIndex: number;
    }> = new EventEmitter<null>();
    @Output() goToDoctor: EventEmitter<number> = new EventEmitter<number>();

    public doctorGroupControls: Observable<{
        doctorFormGroup: FormGroup;
        doctorFormGroupControls: AbstractControl[];
        timeGroup: FormGroup;
    }> = of(null);

    constructor(
        private formSwipeState: FormSwipeStateService,
        private multiStepFormService: MultiStepFormService
    ) {}

    ngOnInit() {
        this.doctorGroupControls = of({
            doctorFormGroup: this.multiStepFormService.getDoctorFormGroup(),
            doctorFormGroupControls:
                this.multiStepFormService.getDoctorFormGroupControls(),
            timeGroup: this.multiStepFormService.getTimeFormGroup(),
        });
    }

    public addDoctorControl() {
        // this.multiStepFormService.addDoctorControl();
        // this.formSwipeState.setCurrentDoctor(docIdx);
        this.doctorGroupControls = of(
            this.multiStepFormService.addDoctorControl()
        ).pipe(
            switchMap(() => {
                const result: {
                    doctorFormGroup: FormGroup;
                    doctorFormGroupControls: AbstractControl[];
                    timeGroup: FormGroup;
                } = {
                    doctorFormGroup:
                        this.multiStepFormService.getDoctorFormGroup(),
                    doctorFormGroupControls:
                        this.multiStepFormService.getDoctorFormGroupControls(),
                    timeGroup: this.multiStepFormService.getTimeFormGroup(),
                };

                return of(result);
            })
        );
    }

    public removeDoctorControl(index: number): void {
        this.doctorGroupControls = of(
            this.multiStepFormService.removeDoctorControl(index)
        ).pipe(
            switchMap(() => {
                const result: {
                    doctorFormGroup: FormGroup;
                    doctorFormGroupControls: AbstractControl[];
                    timeGroup: FormGroup;
                    doctorIdx: number;
                } = {
                    doctorIdx: index,
                    doctorFormGroup:
                        this.multiStepFormService.getDoctorFormGroup(),
                    doctorFormGroupControls:
                        this.multiStepFormService.getDoctorFormGroupControls(),
                    timeGroup: this.multiStepFormService.getTimeFormGroup(),
                };

                return of(result);
            })
        );
    }

    public onDoctorSelected(
        event: SearcheableSelectModel,
        formIndex: number
    ): void {
        if (event.value && event.value !== '') {
            this.doctorSelected.emit({ value: event, formIndex });
        }
    }

    public onGoToDoctor(index: number): void {
        this.goToDoctor.emit(index);
    }
}
