import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-form-modal',
    templateUrl: './form-modal.component.html',
    styleUrls: ['./form-modal.component.scss'],
})
export class FormModalComponent implements OnInit {
    public logWorkForm: FormGroup;

    constructor() {}

    ngOnInit() {
        this.initForm();
    }

    public onSubmit() {
        console.log('submit: ', this.logWorkForm.value);
    }
    private initForm() {
        this.logWorkForm = new FormGroup({
            workItem: new FormControl(null, {
                // updateOn: 'blur',
                validators: [Validators.required],
            }),
            numberOfWorkItems: new FormControl(null, {
                // updateOn: 'blur',
                validators: [Validators.required],
            }),
            doctor: new FormControl(null, {
                // updateOn: 'blur',
                validators: [Validators.required],
            }),
            patient: new FormControl(null, {
                // updateOn: 'blur',
                validators: [Validators.required],
            }),
            startTime: new FormControl(null, {
                // updateOn: 'blur',
                validators: [Validators.required],
            }),
            endTime: new FormControl(null, {
                // updateOn: 'blur',
                validators: [Validators.required],
            }),
        });
    }
}
