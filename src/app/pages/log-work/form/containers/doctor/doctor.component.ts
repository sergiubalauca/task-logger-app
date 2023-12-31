/* eslint-disable @typescript-eslint/member-ordering */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
    inject,
} from '@angular/core';
import {
    AbstractControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { DOCTOR_COLLECTION_NAME, SearcheableSelectModel } from '@shared';
import {
    BehaviorSubject,
    Observable,
    distinctUntilChanged,
    of,
    switchMap,
} from 'rxjs';
import { MultiStepFormService } from '../../services';
import { DatePickerComponent } from '../../components/date-picker/date-picker.component';
import { SearcheableSelectInputComponent } from '../../components/searcheable-select-input/searcheable-select-input.component';
import { IonicModule } from '@ionic/angular';
import { NgIf, NgFor, AsyncPipe, CommonModule } from '@angular/common';
import { FormReducer } from '../../custom-state/reducer/form.reducer';
import { FormSelector } from '../../custom-state/selector/form.selector';
import { TimeTrackingComponent } from '../time-tracking/time-tracking.component';

@Component({
    selector: 'app-doctor',
    templateUrl: './doctor.component.html',
    styleUrls: ['./doctor.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        NgFor,
        SearcheableSelectInputComponent,
        DatePickerComponent,
        AsyncPipe,
        CommonModule,
        TimeTrackingComponent,
    ],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorComponent {
    @Input() public chosenDate: string;
    @Output() doctorSelected: EventEmitter<{
        value: SearcheableSelectModel;
        formIndex: number;
    }> = new EventEmitter<null>();
    @Output() goToDoctor: EventEmitter<number> = new EventEmitter<number>();
    @Output() navigateTimeTracking: EventEmitter<unknown> =
        new EventEmitter<unknown>();

    public formRefresh$: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    public formRefreshObs$: Observable<boolean> =
        this.formRefresh$.asObservable();

    public doctorGroupControls: Observable<{
        form: FormGroup;
        doctorFormGroup?: FormGroup;
        doctorFormGroupControls?: AbstractControl[];
        timeGroup?: FormGroup;
    }> = this.formSelectors.formAlreadySavedForDate$.pipe(
        distinctUntilChanged(),
        switchMap((formAlreadySavedForDate) => {
            if (!formAlreadySavedForDate) {
                this.multiStepFormService.addDoctorControl();
            }
            return this.formRefreshObs$.pipe(
                switchMap((_isFormRefresh: boolean) => {
                    const result: {
                        form: FormGroup;
                        doctorFormGroup?: FormGroup;
                        doctorFormGroupControls?: AbstractControl[];
                        timeGroup?: FormGroup;
                    } = {
                        form: this.multiStepFormService.getForm(),
                        doctorFormGroup:
                            this.multiStepFormService.getDoctorFormGroup(),
                        doctorFormGroupControls:
                            this.multiStepFormService.getDoctorFormGroupControls(),
                        timeGroup: this.multiStepFormService.getTimeFormGroup(),
                    };

                    return of(result);
                })
            );
        })
    );

    public readonly strategy = DOCTOR_COLLECTION_NAME;
    private cdr = inject(ChangeDetectorRef);

    constructor(
        private multiStepFormService: MultiStepFormService,
        private formStore: FormReducer,
        private formSelectors: FormSelector
    ) {
        setInterval(() => {
            this.cdr.markForCheck();
        }, 1000);
    }

    public addDoctorControl() {
        this.formStore.setCurrentPacient(0);
        this.multiStepFormService.addDoctorControl();
        this.formRefresh$.next(true);
    }

    public removeDoctorControl(index: number): void {
        const docArray = this.multiStepFormService.getdoctorArray();
        this.formStore.setCurrentDoctor(docArray.length - 1);
        this.multiStepFormService.removeDoctorControl(index);
        this.formRefresh$.next(true);
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
        this.formStore.setCurrentDoctor(index);
        this.formStore.setCurrentPacient(0);
        this.goToDoctor.emit(index);
    }

    public goToTimeTracking() {
        this.navigateTimeTracking.emit();
    }
}
