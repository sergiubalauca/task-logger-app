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
import { Observable, of, switchMap } from 'rxjs';
import { MultiStepFormService } from '../../services';
import { IonicModule } from '@ionic/angular';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { FormReducer } from '../../custom-state/reducer/form.reducer';
import { FormSelector } from '../../custom-state/selector/form.selector';

@Component({
    selector: 'app-pacient',
    templateUrl: './pacient.component.html',
    styleUrls: ['./pacient.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        NgFor,
        AsyncPipe,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PacientComponent implements OnInit {
    @Output() goToWorkItem: EventEmitter<{
        doctorIdx: number;
        pacientIdx: number;
    }> = new EventEmitter<{ doctorIdx: number; pacientIdx: number }>();

    public patientGroupControls: Observable<{
        patientGroup: FormGroup;
        patientControls: AbstractControl[];
        doctorIdx: number;
    }> = this.formSelectors.currentDoctor$.pipe(
        switchMap((idx: number) => {
            const result: {
                patientGroup: FormGroup;
                patientControls: AbstractControl[];
                doctorIdx: number;
            } = {
                doctorIdx: idx,
                patientGroup:
                    this.multiStepFormService.getPatientGroupFormGroup(idx),
                patientControls:
                    this.multiStepFormService.getPatientControls(idx),
            };

            return of(result);
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
        this.multiStepFormService.removePatientControl(doctorIdx, index);
    }

    public addPatientControl(doctorIdx: number) {
        this.multiStepFormService.addPatientControl(doctorIdx);
    }

    public onGoToWorkItem(doctorIdx: number, pacientIdx: number) {
        this.formStore.setCurrentPacient(pacientIdx);
        this.goToWorkItem.emit({ doctorIdx, pacientIdx });
    }
}
