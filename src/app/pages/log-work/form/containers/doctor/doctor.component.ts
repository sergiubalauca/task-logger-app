/* eslint-disable @typescript-eslint/member-ordering */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
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
    Subject,
    distinct,
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
    ],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DoctorComponent {
    @Input() public chosenDate: string;
    // @Input() public form: any;
    // @Input() public set formValue(form$: Observable<FormGroup>) {
    //     this.formSet = form$.pipe(
    //         switchMap((form) =>
    //             of({
    //                 form,
    //                 doctorFormGroup:
    //                     this.multiStepFormService.getDoctorFormGroup(),
    //                 doctorFormGroupControls:
    //                     this.multiStepFormService.getDoctorFormGroupControls(),
    //                 timeGroup: this.multiStepFormService.getTimeFormGroup(),
    //             })
    //         )
    //     );
    // }

    @Output() doctorSelected: EventEmitter<{
        value: SearcheableSelectModel;
        formIndex: number;
    }> = new EventEmitter<null>();
    @Output() goToDoctor: EventEmitter<number> = new EventEmitter<number>();

    // public formSet: Observable<{
    //     form: FormGroup;
    //     doctorFormGroup?: FormGroup;
    //     doctorFormGroupControls?: AbstractControl[];
    //     timeGroup?: FormGroup;
    // }>;

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
        switchMap((formAlreadySavedForDate) =>
            // this.formSelectors.currentDoctor$.pipe(
            this.formRefreshObs$.pipe(
                switchMap((idx) => {
                    if (!formAlreadySavedForDate) {
                        this.multiStepFormService.addDoctorControl();
                    }

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
            )
        )
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
        this.multiStepFormService.removeDoctorControl(index);
        // this.formStore.setCurrentDoctor(1);
        this.formRefresh$.next(true);
        // setTimeout(() => {
        //     this.formStore.setCurrentDoctor(0);
        // }, 3000);

        // this.formStore.setCurrentPacient(0);
    }

    public onDoctorSelected(
        event: SearcheableSelectModel,
        formIndex: number
    ): void {
        if (event.value && event.value !== '') {
            // this.formStore.setCurrentDoctor(formIndex);
            this.doctorSelected.emit({ value: event, formIndex });
        }
    }

    public onGoToDoctor(index: number): void {
        this.formStore.setCurrentDoctor(index);
        this.formStore.setCurrentPacient(0);
        this.goToDoctor.emit(index);
    }
}
