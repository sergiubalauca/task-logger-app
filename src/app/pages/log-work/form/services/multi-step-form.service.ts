import { Injectable, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DailyWorkDoc } from '@shared';
import { FormReducer } from '../custom-state/reducer/form.reducer';
import {
    dateCompareAgainstValidator,
    overlappingBreaksValidator,
} from '../validators';

@Injectable()
export class MultiStepFormService {
    private multiStepLogWorkForm: FormGroup;

    constructor(private fb: FormBuilder, private formStore: FormReducer) {
        this.getForm()?.valueChanges.subscribe((changes) => {
            console.log('GSB changes: ', changes);
        });
    }

    public buildFormWithData(dailyWork: DailyWorkDoc) {
        dailyWork.doctorGroup.forEach((doctor, doctorIdx) => {
            this.getdoctorArray().push(this.newDoctorWithoutPacients());
            this.getDoctorFormGroupControls()[doctorIdx].patchValue({
                doctor: doctor.doctor.name,
            });

            doctor.doctor.pacient.forEach((pacient, pacientIdx) => {
                this.getPatientArray(doctorIdx).push(
                    this.newPatientWithoutWorkItems()
                );
                this.getPatientControls(doctorIdx)[pacientIdx].patchValue({
                    patient: pacient.name,
                });

                pacient.workItemProps.forEach((workItem, workItemIdx) => {
                    this.getWorkItemArray(doctorIdx, pacientIdx).push(
                        this.newWorkItem()
                    );
                    this.getWorkItemControls(doctorIdx, pacientIdx)[
                        workItemIdx
                    ].patchValue({
                        workItem: workItem.workItem.name,
                        numberOfWorkItems: workItem.numberOfWorkItems,
                        color: workItem.color,
                    });
                });
            });
        });

        dailyWork.breaks?.forEach((breakItem, breakIdx) => {
            if (breakIdx > 0) {
                this.addBreak();
            }
            this.getTimeFormGroupControls()[breakIdx].patchValue({
                startTime: breakItem.startTime,
                endTime: breakItem.endTime,
            });
        });
    }

    public initMultiStepForm(dailyWork: any) {
        this.formStore.setFormAlreadySavedForDate(false);
        if (this.multiStepLogWorkForm) {
            return this.multiStepLogWorkForm;
        }

        this.multiStepLogWorkForm = this.fb.group({
            doctorGroup: this.fb.group({
                doctorArray: this.fb.array([]),
            }),
            timeGroup: this.fb.group({
                startTime: this.fb.control(dailyWork?.startTime ?? null, {
                    validators: [
                        Validators.required,
                        dateCompareAgainstValidator('endTime', 'lessThan'),
                    ],
                }),
                endTime: this.fb.control(dailyWork?.endTime ?? null, {
                    validators: [
                        Validators.required,
                        dateCompareAgainstValidator('startTime', 'greaterThan'),
                    ],
                }),
                breaks: this.fb.array([
                    this.fb.group({
                        startTime: this.fb.control(null, {
                            validators: [
                                dateCompareAgainstValidator(
                                    'endTime',
                                    'lessThan'
                                ),
                                dateCompareAgainstValidator(
                                    'startTime',
                                    'greaterThanOrEqualTo',
                                    true
                                ),
                                overlappingBreaksValidator('endTime'),
                            ],
                        }),
                        endTime: this.fb.control(null, {
                            validators: [
                                dateCompareAgainstValidator(
                                    'startTime',
                                    'greaterThan'
                                ),
                                dateCompareAgainstValidator(
                                    'endTime',
                                    'lessThanOrEqualTo',
                                    true
                                ),
                                overlappingBreaksValidator('startTime'),
                            ],
                        }),
                    }),
                ]),
            }),
        });
        if (dailyWork) {
            this.formStore.setFormAlreadySavedForDate(true);
            this.buildFormWithData(dailyWork);
            return this.multiStepLogWorkForm;
        }
        return this.multiStepLogWorkForm;
    }

    public getDoctorFormGroup() {
        return this.multiStepLogWorkForm.get('doctorGroup') as FormGroup;
    }

    public getDoctorFormGroupControls() {
        return (this.getDoctorFormGroup().controls.doctorArray as FormArray)
            .controls;
    }

    public getdoctorArray() {
        return this.getDoctorFormGroup().get('doctorArray') as FormArray;
    }

    public addDoctorControl() {
        this.getdoctorArray().push(this.newDoctor());
        this.getdoctorArray().updateValueAndValidity();
    }

    public removeDoctorControl(doctorIndex: number) {
        const patientArray = this.getPatientArray(doctorIndex);
        for (let i = patientArray.length - 1; i >= 0; i--) {
            this.removePatientControl(doctorIndex, i);
        }
        this.getPatientArray(doctorIndex).updateValueAndValidity();
        this.getdoctorArray().controls.splice(doctorIndex, 1);
        this.getdoctorArray().updateValueAndValidity();

        console.log('GSB form: ', this.multiStepLogWorkForm);
    }

    public newDoctorWithoutPacients = () =>
        this.fb.group({
            doctor: this.fb.control(null, {
                validators: [Validators.required],
            }),
            patientGroup: this.fb.group({
                patientArray: this.fb.array([], {
                    validators: [Validators.required],
                }),
            }),
        });

    public newDoctor = () =>
        this.fb.group({
            doctor: this.fb.control(null, {
                validators: [Validators.required],
            }),
            patientGroup: this.fb.group({
                patientArray: this.fb.array(
                    [
                        this.fb.group({
                            patient: this.fb.control(null, {
                                validators: [Validators.required],
                            }),
                            workItemGroup: this.fb.group({
                                workItemProps: this.fb.array(
                                    [
                                        this.fb.group({
                                            workItem: this.fb.control(null, {
                                                validators: [
                                                    Validators.required,
                                                ],
                                            }),
                                            numberOfWorkItems: this.fb.control(
                                                null,
                                                {
                                                    validators: [
                                                        Validators.required,
                                                        Validators.min(1),
                                                        Validators.pattern(
                                                            /^[0-9]+(\.[0-9]{1,2})?$/
                                                        ),
                                                    ],
                                                }
                                            ),
                                            color: this.fb.control(null, {
                                                validators: [
                                                    Validators.required,
                                                ],
                                            }),
                                        }),
                                    ],
                                    { validators: [Validators.required] }
                                ),
                            }),
                        }),
                    ],
                    { validators: [Validators.required] }
                ),
            }),
        });

    public getTimeFormGroup() {
        return this.multiStepLogWorkForm.get('timeGroup') as FormGroup;
    }

    public getTimeFormGroupControls() {
        return (this.getTimeFormGroup().controls.breaks as FormArray).controls;
    }

    public newBreak = () =>
        this.fb.group({
            startTime: this.fb.control(null, {
                validators: [
                    Validators.required,
                    dateCompareAgainstValidator('endTime', 'lessThan'),
                    dateCompareAgainstValidator(
                        'startTime',
                        'greaterThanOrEqualTo',
                        true
                    ),
                    overlappingBreaksValidator('endTime'),
                ],
            }),
            endTime: this.fb.control(null, {
                validators: [
                    Validators.required,
                    dateCompareAgainstValidator('startTime', 'greaterThan'),
                    dateCompareAgainstValidator(
                        'endTime',
                        'lessThanOrEqualTo',
                        true
                    ),
                    overlappingBreaksValidator('startTime'),
                ],
            }),
        });

    public getBreaksArray() {
        return this.getTimeFormGroup().controls.breaks as FormArray;
    }

    public addBreak() {
        this.getBreaksArray().push(this.newBreak());
        this.getBreaksArray().updateValueAndValidity();
    }

    public deleteBreak(index: number) {
        this.getBreaksArray().controls.splice(index, 1);
        this.getBreaksArray().updateValueAndValidity();
    }

    public getPatientGroupFormGroup(doctorIndex?: number) {
        const doctorArray = (this.getDoctorFormGroup()?.controls?.doctorArray ??
            []) as FormArray;
        const doctorFormGroup = doctorArray.controls[doctorIndex] as FormGroup;
        return (doctorFormGroup?.controls?.patientGroup as FormGroup) ?? null;
    }

    public getPatientControls(doctorIdx: number) {
        const patientControls =
            (
                (this.getPatientGroupFormGroup(doctorIdx)?.controls
                    ?.patientArray ?? []) as FormArray
            )?.controls ?? null;
        return patientControls;
    }

    public getPatientArray(index: number) {
        return (this.getPatientGroupFormGroup(index)?.get('patientArray') ??
            []) as FormArray;
    }

    public addPatientControl(index: number) {
        this.getPatientArray(index).push(this.newPatient());
        this.getPatientArray(index).updateValueAndValidity();
    }

    public removePatientControl(doctorIndex: number, pacientIndex: number) {
        // delete work items for this patient
        const workItemArray = this.getWorkItemArray(doctorIndex, pacientIndex);
        for (let i = workItemArray.length - 1; i >= 0; i--) {
            this.removeWorkItemControl(doctorIndex, pacientIndex, i);
        }
        this.getWorkItemArray(
            doctorIndex,
            pacientIndex
        ).updateValueAndValidity();
        this.getPatientArray(doctorIndex).controls.splice(pacientIndex, 1);
        this.getPatientArray(doctorIndex).updateValueAndValidity();
    }

    public newPatientWithoutWorkItems = () =>
        this.fb.group({
            patient: this.fb.control(null, {
                validators: [Validators.required],
            }),
            workItemGroup: this.fb.group({
                workItemProps: this.fb.array([], {
                    validators: [Validators.required],
                }),
            }),
        });

    public newPatient = () =>
        this.fb.group({
            patient: this.fb.control(null, {
                validators: [Validators.required],
            }),
            workItemGroup: this.fb.group({
                workItemProps: this.fb.array(
                    [
                        this.fb.group({
                            workItem: this.fb.control(null, {
                                validators: [Validators.required],
                            }),
                            numberOfWorkItems: this.fb.control(null, {
                                validators: [
                                    Validators.required,
                                    Validators.min(1),
                                    Validators.pattern(
                                        /^[0-9]+(\.[0-9]{1,2})?$/
                                    ),
                                ],
                            }),
                            color: this.fb.control(null, {
                                validators: [Validators.required],
                            }),
                        }),
                    ],
                    {
                        validators: [Validators.required],
                    }
                ),
            }),
        });

    public getWorkItemGroupFormGroup(
        doctorIndex?: number,
        patientIndex?: number
    ) {
        const patientArray = this.getPatientGroupFormGroup(doctorIndex)
            ?.controls.patientArray as FormArray;
        const patientFormGroup = patientArray.controls[
            patientIndex
        ] as FormGroup;
        return (patientFormGroup?.controls?.workItemGroup ?? null) as FormGroup;
    }

    public getWorkItemControls(doctorIndex?: number, patientIndex?: number) {
        const workItemControls =
            (
                (this.getWorkItemGroupFormGroup(doctorIndex, patientIndex)
                    ?.controls?.workItemProps ?? null) as FormArray
            )?.controls ?? null;
        return workItemControls;
    }

    public getWorkItemArray(doctorIndex?: number, patientIndex?: number) {
        const workItemArray = this.getWorkItemGroupFormGroup(
            doctorIndex,
            patientIndex
        )?.get('workItemProps') as FormArray;
        return workItemArray;
    }

    public addWorkItemControl(doctorIndex?: number, patientIndex?: number) {
        this.getWorkItemArray(doctorIndex, patientIndex).push(
            this.newWorkItem()
        );
        this.getWorkItemArray(
            doctorIndex,
            patientIndex
        ).updateValueAndValidity();
    }

    public removeWorkItemControl(
        doctorIndex?: number,
        patientIndex?: number,
        workItemIndex?: number
    ) {
        this.getWorkItemArray(doctorIndex, patientIndex).controls.splice(
            workItemIndex,
            1
        );
        this.getWorkItemArray(
            doctorIndex,
            patientIndex
        ).updateValueAndValidity();
    }

    public newWorkItem = () =>
        this.fb.group({
            workItem: this.fb.control(null, {
                validators: [Validators.required],
            }),
            numberOfWorkItems: this.fb.control(null, {
                validators: [
                    Validators.required,
                    Validators.min(1),
                    Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/),
                ],
            }),
            color: this.fb.control(null, {
                validators: [Validators.required],
            }),
        });

    public resetForm() {
        this.multiStepLogWorkForm.reset();
        this.multiStepLogWorkForm = null;
    }

    public getForm() {
        return this.multiStepLogWorkForm;
    }
}
