import { Component, OnInit } from '@angular/core';
import {
    FormGroup,
    AbstractControl,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { combineLatest, Observable, of, switchMap } from 'rxjs';
import { FormSwipeStateService, MultiStepFormService } from '../../services';
import { SearcheableSelectInputComponent } from '../../components/searcheable-select-input/searcheable-select-input.component';
import { IonicModule } from '@ionic/angular';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { WORK_ITEM_COLLECTION_NAME } from '@shared';
import { FormSelector } from '../../custom-state/selector/form.selector';

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
        // this.formSwiperState.getCurrentDoctor(),
        // this.formSwiperState.getCurrentPacient(),
        this.formSelectors.currentDoctor$,
        this.formSelectors.currentPacient$,
    ]).pipe(
        switchMap(([currentDoctorIndex, currentPacientIndex]) => {
            const result: {
                workItemGroup: FormGroup;
                workItemControls: AbstractControl[];
                doctorIdx: number;
                pacientIdx: number;
            } = {
                doctorIdx: currentDoctorIndex,
                pacientIdx: currentPacientIndex,
                workItemGroup:
                    this.multiStepFormService.getWorkItemGroupFormGroup(
                        currentDoctorIndex,
                        currentPacientIndex
                    ),
                workItemControls: this.multiStepFormService.getWorkItemControls(
                    currentDoctorIndex,
                    currentPacientIndex
                ),
            };

            return of(result);
        })
    );

    constructor(
        private multiStepFormService: MultiStepFormService,
        private formSwiperState: FormSwipeStateService,
        private formSelectors: FormSelector
    ) {}

    ngOnInit() {}

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
            // this.formSwiperState.getCurrentDoctor(),
            // this.formSwiperState.getCurrentPacient(),
            this.formSelectors.currentDoctor$,
            this.formSelectors.currentPacient$,
        ]).pipe(
            switchMap(([currentDoctorIndex, currentPacientIndex]) => {
                const result: {
                    workItemGroup: FormGroup;
                    workItemControls: AbstractControl[];
                    doctorIdx: number;
                    pacientIdx: number;
                } = {
                    doctorIdx: currentDoctorIndex,
                    pacientIdx: currentPacientIndex,
                    workItemGroup:
                        this.multiStepFormService.getWorkItemGroupFormGroup(
                            currentDoctorIndex,
                            currentPacientIndex
                        ),
                    workItemControls:
                        this.multiStepFormService.getWorkItemControls(
                            currentDoctorIndex,
                            currentPacientIndex
                        ),
                };

                return of(result);
            })
        );
    }

    public addWorkItemControl(doctorIdx: number, pacientIdx: number) {
        this.multiStepFormService.addWorkItemControl(doctorIdx, pacientIdx);
        this.workItemGroupControls = combineLatest([
            // this.formSwiperState.getCurrentDoctor(),
            // this.formSwiperState.getCurrentPacient(),
            this.formSelectors.currentDoctor$,
            this.formSelectors.currentPacient$,
        ]).pipe(
            switchMap(([currentDoctorIndex, currentPacientIndex]) => {
                const result: {
                    workItemGroup: FormGroup;
                    workItemControls: AbstractControl[];
                    doctorIdx: number;
                    pacientIdx: number;
                } = {
                    doctorIdx: currentDoctorIndex,
                    pacientIdx: currentPacientIndex,
                    workItemGroup:
                        this.multiStepFormService.getWorkItemGroupFormGroup(
                            currentDoctorIndex,
                            currentPacientIndex
                        ),
                    workItemControls:
                        this.multiStepFormService.getWorkItemControls(
                            currentDoctorIndex,
                            currentPacientIndex
                        ),
                };

                return of(result);
            })
        );
    }
}
