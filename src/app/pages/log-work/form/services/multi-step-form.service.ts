import { Injectable } from '@angular/core';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { DailyWorkDoc } from '@shared';
import { Observable, of } from 'rxjs';
import { FormReducer } from '../custom-state/reducer/form.reducer';

@Injectable()
export class MultiStepFormService {
    private multiStepLogWorkForm: FormGroup;

    constructor(private fb: FormBuilder, private formStore: FormReducer) {}

    public setPacientForm(doctorIdx: number): Observable<{
        doctorIdx: number;
        patientGroup: FormGroup<any>;
        patientControls: AbstractControl<any, any>[];
    }> {
        return of({
            doctorIdx,
            patientGroup: this.getPatientGroupFormGroup(doctorIdx),
            patientControls: this.getPatientControls(doctorIdx),
        });
    }

    public buildFormWithData(dailyWork: DailyWorkDoc) {
        dailyWork.doctorGroup.forEach((doctor, doctorIdx) => {
            // this.addDoctorControl();
            // console.log('GSB: ', this.getdoctorArray());
            this.getdoctorArray().push(this.newDoctor());
            this.getDoctorFormGroupControls()[doctorIdx].patchValue({
                doctor: doctor.doctor.name,
            });

            doctor.doctor.pacient.forEach((pacient, pacientIdx) => {
                // this.addPatientControl(doctorIdx);
                this.getPatientArray(pacientIdx).push(
                    this.newPatient()
                );
                this.getPatientControls(doctorIdx)[pacientIdx].patchValue({
                    patient: pacient.name,
                });

                pacient.workItemAndNumber.forEach((workItem, workItemIdx) => {
                    this.getWorkItemArray(doctorIdx, pacientIdx).push(
                        this.newWorkItem()
                    );

                    this.getWorkItemControls(doctorIdx, pacientIdx)[
                        workItemIdx
                    ].patchValue({
                        workItem: workItem.workItem.name,
                        workItemNumber: workItem.numberOfWorkItems,
                    });
                });
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
                    validators: [Validators.required],
                }),
                endTime: this.fb.control(dailyWork?.endTime ?? null, {
                    validators: [Validators.required],
                }),
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
        return this.getdoctorArray().push(this.newDoctor());
    }

    public removeDoctorControl(doctorIndex: number) {
        // remove also it's pacients
        // this.getPatientArray(doctorIndex).clear();
        return this.getDoctorFormGroupControls().splice(doctorIndex, 1);
    }

    public newDoctorWithoutPacients = () =>
        this.fb.group({
            doctor: this.fb.control(null, {
                validators: [Validators.required],
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
                                workItemAndNumber: this.fb.array(
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
                                                    ],
                                                }
                                            ),
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

    public getPatientGroupFormGroup(doctorIndex?: number) {
        const doctorArray = (this.getDoctorFormGroup()?.controls?.doctorArray ??
            []) as FormArray;
        const doctorFormGroup = doctorArray.controls[doctorIndex] as FormGroup;
        return doctorFormGroup.controls.patientGroup as FormGroup;
    }

    public getPatientControls(doctorIdx: number) {
        const patientControls = (
            (this.getPatientGroupFormGroup(doctorIdx)?.controls?.patientArray ??
                []) as FormArray
        ).controls;
        return patientControls;
    }

    public getPatientArray(index: number) {
        const x = (this.getPatientGroupFormGroup(index)?.get('patientArray') ??
            []) as FormArray;
        // const x = this.getPatientControls(index);
        return x;
    }

    public addPatientControl(index: number) {
        return this.getPatientArray(index).push(this.newPatient());
    }

    public removePatientControl(doctorIndex: number, pacientIndex: number) {
        return this.getPatientArray(doctorIndex).controls.splice(
            pacientIndex,
            1
        );
    }

    public newPatientWithoutWorkItems = () =>
        this.fb.group({
            patient: this.fb.control(null, {
                validators: [Validators.required],
            }),
        });

    public newPatient = () =>
        this.fb.group({
            patient: this.fb.control(null, {
                validators: [Validators.required],
            }),
            workItemGroup: this.fb.group({
                workItemAndNumber: this.fb.array(
                    [
                        this.fb.group({
                            workItem: this.fb.control(null, {
                                validators: [Validators.required],
                            }),
                            numberOfWorkItems: this.fb.control(null, {
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
        const patientArray = this.getPatientGroupFormGroup(doctorIndex).controls
            .patientArray as FormArray;
        const patientFormGroup = patientArray.controls[
            patientIndex
        ] as FormGroup;
        return (patientFormGroup?.controls?.workItemGroup ?? null) as FormGroup;
    }

    public getWorkItemControls(doctorIndex?: number, patientIndex?: number) {
        const workItemControls =
            (
                (this.getWorkItemGroupFormGroup(doctorIndex, patientIndex)
                    ?.controls?.workItemAndNumber ?? null) as FormArray
            )?.controls ?? null;
        return workItemControls;
    }

    public getWorkItemArray(doctorIndex?: number, patientIndex?: number) {
        const workItemArray = this.getWorkItemGroupFormGroup(
            doctorIndex,
            patientIndex
        )?.get('workItemAndNumber') as FormArray;
        return workItemArray;
    }

    public addWorkItemControl(doctorIndex?: number, patientIndex?: number) {
        return this.getWorkItemArray(doctorIndex, patientIndex).push(
            this.newWorkItem()
        );
    }

    public removeWorkItemControl(
        doctorIndex?: number,
        patientIndex?: number,
        workItemIndex?: number
    ) {
        return this.getWorkItemArray(doctorIndex, patientIndex).controls.splice(
            workItemIndex,
            1
        );
    }

    public newWorkItem = () =>
        this.fb.group({
            workItem: this.fb.control(null, {
                validators: [Validators.required],
            }),
            numberOfWorkItems: this.fb.control(null, {
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
