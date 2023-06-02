import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, Observable, of, switchMap } from 'rxjs';
import { FormSwipeStateService, MultiStepFormService } from '../../services';
import { SearcheableSelectInputComponent } from '../../components/searcheable-select-input/searcheable-select-input.component';
import { IonicModule } from '@ionic/angular';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { WORK_ITEM_COLLECTION_NAME } from '@shared';

@Component({
    selector: 'app-work-item',
    templateUrl: './work-item.component.html',
    styleUrls: ['./work-item.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        NgFor,
        SearcheableSelectInputComponent,
        AsyncPipe,
    ],
})
export class WorkItemComponent implements OnInit {
    public readonly strategy = WORK_ITEM_COLLECTION_NAME;
    public workItemGroupControls: Observable<{
        workItemGroup: FormGroup;
        workItemControls: AbstractControl[];
        doctorIdx: number;
        pacientIdx: number;
    }> = combineLatest([
        this.formSwiperState.getCurrentDoctor(),
        this.formSwiperState.getCurrentPacient(),
    ]).pipe(
        switchMap(
            (doctorPacientIndexes: [{ index: number }, { index: number }]) => {
                const result: {
                    workItemGroup: FormGroup;
                    workItemControls: AbstractControl[];
                    doctorIdx: number;
                    pacientIdx: number;
                } = {
                    doctorIdx: doctorPacientIndexes[0].index,
                    pacientIdx: doctorPacientIndexes[1].index,
                    workItemGroup:
                        this.multiStepFormService.getWorkItemGroupFormGroup(
                            doctorPacientIndexes[0].index,
                            doctorPacientIndexes[1].index
                        ),
                    workItemControls:
                        this.multiStepFormService.getWorkItemControls(
                            doctorPacientIndexes[0].index,
                            doctorPacientIndexes[1].index
                        ),
                };

                return of(result);
            }
        )
    );

    constructor(
        private multiStepFormService: MultiStepFormService,
        private formSwiperState: FormSwipeStateService
    ) {}

    ngOnInit() {
    }

    public removeWorkItemControl(
        index: number,
        doctorIdx: number,
        pacientIdx: number
    ) {
        this.multiStepFormService.removeWorkItemControl(
            doctorIdx,
            pacientIdx,
            index
        );
        this.workItemGroupControls = combineLatest([
            this.formSwiperState.getCurrentDoctor(),
            this.formSwiperState.getCurrentPacient(),
        ]).pipe(
            switchMap(
                (
                    doctorPacientIndexes: [{ index: number }, { index: number }]
                ) => {
                    const result: {
                        workItemGroup: FormGroup;
                        workItemControls: AbstractControl[];
                        doctorIdx: number;
                        pacientIdx: number;
                    } = {
                        doctorIdx: doctorPacientIndexes[0].index,
                        pacientIdx: doctorPacientIndexes[1].index,
                        workItemGroup:
                            this.multiStepFormService.getWorkItemGroupFormGroup(
                                doctorPacientIndexes[0].index,
                                doctorPacientIndexes[1].index
                            ),
                        workItemControls:
                            this.multiStepFormService.getWorkItemControls(
                                doctorPacientIndexes[0].index,
                                doctorPacientIndexes[1].index
                            ),
                    };

                    return of(result);
                }
            )
        );
    }

    public addWorkItemControl(doctorIdx: number, pacientIdx: number) {
        this.multiStepFormService.addWorkItemControl(doctorIdx, pacientIdx);
        this.workItemGroupControls = combineLatest([
            this.formSwiperState.getCurrentDoctor(),
            this.formSwiperState.getCurrentPacient(),
        ]).pipe(
            switchMap(
                (
                    doctorPacientIndexes: [{ index: number }, { index: number }]
                ) => {
                    const result: {
                        workItemGroup: FormGroup;
                        workItemControls: AbstractControl[];
                        doctorIdx: number;
                        pacientIdx: number;
                    } = {
                        doctorIdx: doctorPacientIndexes[0].index,
                        pacientIdx: doctorPacientIndexes[1].index,
                        workItemGroup:
                            this.multiStepFormService.getWorkItemGroupFormGroup(
                                doctorPacientIndexes[0].index,
                                doctorPacientIndexes[1].index
                            ),
                        workItemControls:
                            this.multiStepFormService.getWorkItemControls(
                                doctorPacientIndexes[0].index,
                                doctorPacientIndexes[1].index
                            ),
                    };

                    return of(result);
                }
            )
        );
    }
}
