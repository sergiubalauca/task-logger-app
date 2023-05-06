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
    }>;

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

    public removePatientControl(index: number, doctorIdx: number) {
        this.multiStepFormService.removePatientControl(doctorIdx, index);
        // this.patientGroupControls = this.formSwiperState
        //     .getCurrentDoctor()
        //     .pipe(
        //         switchMap((idx: { index: number }) => {
        //             this.multiStepFormService.removePatientControl(
        //                 idx.index,
        //                 index
        //             );

        //             return of({
        //                 doctorIdx: idx.index,
        //                 patientGroup:
        //                     this.multiStepFormService.getPatientGroupFormGroup(
        //                         idx.index
        //                     ),
        //                 patientControls:
        //                     this.multiStepFormService.getPatientControls(
        //                         idx.index
        //                     ),
        //             });
        //         })
        //     );
    }

    public addPatientControl(doctorIdx: number) {
        this.multiStepFormService.addPatientControl(doctorIdx);
        // this.patientGroupControls = of(
        //     this.multiStepFormService.addPatientControl(doctorIdx)
        // ).pipe(
        //     switchMap(() =>
        //         // this.multiStepFormService.addPatientControl(doctorIdx);
        //         of({
        //             doctorIdx,
        //             patientGroup:
        //                 this.multiStepFormService.getPatientGroupFormGroup(
        //                     doctorIdx
        //                 ),
        //             patientControls:
        //                 this.multiStepFormService.getPatientControls(doctorIdx),
        //         })
        //     )
        // );

        // this.patientGroupControls.subscribe((res) => {
        //     console.log('GSB: ', res);
        // });
    }
}
