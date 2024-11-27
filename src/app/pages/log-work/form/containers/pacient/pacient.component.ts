import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
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
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { MultiStepFormService } from '../../services';
import { IonicModule } from '@ionic/angular';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { FormReducer } from '../../custom-state/reducer/form.reducer';
import { FormSelector } from '../../custom-state/selector/form.selector';
import {
    AddButtonComponent,
    ItemSlidingCardComponent,
    SuppressTouchMoveDirective,
    TranslateErrorPipe,
    UppercaseDirective,
} from '@shared';

@Component({
    selector: 'app-pacient',
    templateUrl: './pacient.component.html',
    styleUrls: ['./pacient.component.scss'],
    imports: [
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        NgFor,
        AsyncPipe,
        ItemSlidingCardComponent,
        SuppressTouchMoveDirective,
        TranslateErrorPipe,
        UppercaseDirective,
        AddButtonComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PacientComponent implements OnInit {
    @Output() goToWorkItem: EventEmitter<{
        doctorIdx: number;
        pacientIdx: number;
    }> = new EventEmitter<{ doctorIdx: number; pacientIdx: number }>();

    public formRefresh$: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    public formRefreshObs$: Observable<boolean> =
        this.formRefresh$.asObservable();

    public patientGroupControls: Observable<{
        patientGroup: FormGroup;
        patientControls: AbstractControl[];
        doctorIdx: number;
    }> = this.formSelectors.currentDoctor$.pipe(
        switchMap((idx: number) => {
            return this.formRefreshObs$.pipe(
                switchMap((_isFormRefresh: boolean) => {
                    const result: {
                        patientGroup: FormGroup;
                        patientControls: AbstractControl[];
                        doctorIdx: number;
                    } = {
                        doctorIdx: idx,
                        patientGroup:
                            this.multiStepFormService.getPatientGroupFormGroup(
                                idx
                            ),
                        patientControls:
                            this.multiStepFormService.getPatientControls(idx),
                    };

                    return of(result);
                })
            );
        })
    );
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

    ngOnInit() {}

    public removePatientControl(index: number, doctorIdx: number) {
        const patientArray =
            this.multiStepFormService.getPatientArray(doctorIdx);
        this.formStore.setCurrentPacient(patientArray.length - 1);
        this.multiStepFormService.removePatientControl(doctorIdx, index);
        this.formRefresh$.next(true);
    }

    public addPatientControl(doctorIdx: number) {
        this.formStore.setCurrentPacient(0);
        this.multiStepFormService.addPatientControl(doctorIdx);
        this.formRefresh$.next(true);
    }

    public onGoToWorkItem(doctorIdx: number, pacientIdx: number, pacient) {
        this.formStore.setCurrentPacient(pacientIdx);
        this.formStore.setCurrentPacientBreadcrumb(pacient);
        this.goToWorkItem.emit({ doctorIdx, pacientIdx });
    }
}
