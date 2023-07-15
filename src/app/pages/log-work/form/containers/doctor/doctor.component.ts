import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    AbstractControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { DOCTOR_COLLECTION_NAME, SearcheableSelectModel } from '@shared';
import { Observable, of, switchMap } from 'rxjs';
import { MultiStepFormService } from '../../services';
import { DatePickerComponent } from '../../components/date-picker/date-picker.component';
import { SearcheableSelectInputComponent } from '../../components/searcheable-select-input/searcheable-select-input.component';
import { IonicModule } from '@ionic/angular';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
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
    ],
    providers: [],
})
export class DoctorComponent implements OnInit {
    @Input() public chosenDate: string;
    @Input() public form: any;
    @Output() doctorSelected: EventEmitter<{
        value: SearcheableSelectModel;
        formIndex: number;
    }> = new EventEmitter<null>();
    @Output() goToDoctor: EventEmitter<number> = new EventEmitter<number>();

    public doctorGroupControls: Observable<{
        form: FormGroup;
        doctorFormGroup?: FormGroup;
        doctorFormGroupControls?: AbstractControl[];
        timeGroup?: FormGroup;
    }>;
    // = of({
    //     form: this.multiStepFormService.initMultiStepForm(null),
    //     // doctorFormGroup: this.multiStepFormService.getDoctorFormGroup(),
    //     // doctorFormGroupControls:
    //     //     this.multiStepFormService.getDoctorFormGroupControls(),
    //     // timeGroup: this.multiStepFormService.getTimeFormGroup(),
    // });

    public readonly strategy = DOCTOR_COLLECTION_NAME;

    constructor(
        private multiStepFormService: MultiStepFormService,
        private formStore: FormReducer,
        private formSelectors: FormSelector
    ) {}

    ngOnInit() {
        this.doctorGroupControls =
            this.formSelectors.formAlreadySavedForDate$.pipe(
                switchMap((formAlreadySavedForDate) => {
                    if (!formAlreadySavedForDate) {
                        this.multiStepFormService.addDoctorControl();
                    }

                    return of({
                        form: this.form,
                        doctorFormGroup:
                            this.multiStepFormService.getDoctorFormGroup(),
                        doctorFormGroupControls:
                            this.multiStepFormService.getDoctorFormGroupControls(),
                        timeGroup: this.multiStepFormService.getTimeFormGroup(),
                    });
                })
            );
    }

    public addDoctorControl() {
        this.formStore.setCurrentPacient(0);
        this.multiStepFormService.addDoctorControl();
    }

    public removeDoctorControl(index: number): void {
        this.formStore.setCurrentDoctor(0);
        this.formStore.setCurrentPacient(0);
        this.multiStepFormService.removeDoctorControl(index);
    }

    public onDoctorSelected(
        event: SearcheableSelectModel,
        formIndex: number
    ): void {
        if (event.value && event.value !== '') {
            this.formStore.setCurrentDoctor(formIndex);
            this.doctorSelected.emit({ value: event, formIndex });
        }
    }

    public onGoToDoctor(index: number): void {
        this.formStore.setCurrentDoctor(index);
        this.goToDoctor.emit(index);
    }
}
