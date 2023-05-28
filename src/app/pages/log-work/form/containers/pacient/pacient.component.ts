import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map, Observable, of, switchMap } from 'rxjs';
import { FormSwipeStateService, MultiStepFormService } from '../../services';
import { IonicModule } from '@ionic/angular';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

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
    }> = this.formSwiperState.getCurrentDoctor().pipe(
        switchMap((idx: { index: number }) => {
            const result: {
                patientGroup: FormGroup;
                patientControls: AbstractControl[];
                doctorIdx: number;
            } = {
                doctorIdx: idx.index,
                patientGroup:
                    this.multiStepFormService.getPatientGroupFormGroup(
                        idx.index
                    ),
                patientControls: this.multiStepFormService.getPatientControls(
                    idx.index
                ),
            };

            return of(result);
        })
    );

    constructor(
        private multiStepFormService: MultiStepFormService,
        private formSwiperState: FormSwipeStateService
    ) {}

    ngOnInit() {
        // this.patientGroupControls = this.formSwiperState
        //     .getCurrentDoctor()
        //     .pipe(
        //         switchMap((idx: { index: number }) => {
        //             const result: {
        //                 patientGroup: FormGroup;
        //                 patientControls: AbstractControl[];
        //                 doctorIdx: number;
        //             } = {
        //                 doctorIdx: idx.index,
        //                 patientGroup:
        //                     this.multiStepFormService.getPatientGroupFormGroup(
        //                         idx.index
        //                     ),
        //                 patientControls:
        //                     this.multiStepFormService.getPatientControls(
        //                         idx.index
        //                     ),
        //             };
        //             return of(result);
        //         })
        //     );
    }

    public removePatientControl(index: number, doctorIdx: number) {
        this.multiStepFormService.removePatientControl(doctorIdx, index);
        // this.patientGroupControls = this.formSwiperState
        //     .getCurrentDoctor()
        //     .pipe(
        //         switchMap((idx: { index: number }) => {
        //             const result: {
        //                 patientGroup: FormGroup;
        //                 patientControls: AbstractControl[];
        //                 doctorIdx: number;
        //             } = {
        //                 doctorIdx: idx.index,
        //                 patientGroup:
        //                     this.multiStepFormService.getPatientGroupFormGroup(
        //                         idx.index
        //                     ),
        //                 patientControls:
        //                     this.multiStepFormService.getPatientControls(
        //                         idx.index
        //                     ),
        //             };

        //             return of(result);
        //         })
        //     );
    }

    public addPatientControl(doctorIdx: number) {
        this.multiStepFormService.addPatientControl(doctorIdx);
        // this.patientGroupControls = this.formSwiperState
        //     .getCurrentDoctor()
        //     .pipe(
        //         switchMap((idx: { index: number }) => {
        //             const result: {
        //                 patientGroup: FormGroup;
        //                 patientControls: AbstractControl[];
        //                 doctorIdx: number;
        //             } = {
        //                 doctorIdx: idx.index,
        //                 patientGroup:
        //                     this.multiStepFormService.getPatientGroupFormGroup(
        //                         idx.index
        //                     ),
        //                 patientControls:
        //                     this.multiStepFormService.getPatientControls(
        //                         idx.index
        //                     ),
        //             };

        //             return of(result);
        //         })
        //     );
    }

    public onGoToWorkItem(doctorIdx: number, pacientIdx: number) {
        this.formSwiperState.setCurrentPacient(pacientIdx);
        this.goToWorkItem.emit({ doctorIdx, pacientIdx });
    }
}
