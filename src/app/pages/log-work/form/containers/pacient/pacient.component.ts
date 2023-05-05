import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { map, Observable, of, switchMap } from 'rxjs';
import { FormSwipeStateService, MultiStepFormService } from '../../services';

@Component({
    selector: 'app-pacient',
    templateUrl: './pacient.component.html',
    styleUrls: ['./pacient.component.scss'],
})
export class PacientComponent implements OnInit {
    public patientGroupControls: Observable<{
        patientGroup: FormGroup;
        patientControls: AbstractControl[];
        doctorIdx: number;
    }> = of(null);

    constructor(
        private multiStepFormService: MultiStepFormService,
        private formSwiperState: FormSwipeStateService
    ) {}

    ngOnInit() {
        this.patientGroupControls = this.formSwiperState
            .getCurrentDoctor()
            .pipe(
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
                        patientControls:
                            this.multiStepFormService.getPatientControls(
                                idx.index
                            ),
                    };

                    return of(result);
                })
            );
    }

    public removePatientControl(index: number) {
        this.patientGroupControls = this.patientGroupControls.pipe(
            map(
                (controls: {
                    patientGroup: FormGroup<any>;
                    patientControls: AbstractControl<any, any>[];
                    doctorIdx: number;
                }) => {
                    // controls.patientControls.splice(index, 1);
                    this.multiStepFormService.removePatientControl(controls.doctorIdx, index);
                    return controls;
                }
            )
        );
        // this.multiStepFormService.removePatientControl(index);
    }

    public addPatientControl(docIdx: number) {
        this.multiStepFormService.addPatientControl(docIdx);
    }
}
