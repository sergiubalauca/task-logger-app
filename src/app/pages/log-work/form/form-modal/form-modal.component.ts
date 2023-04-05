import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
@Component({
    selector: 'app-form-modal',
    templateUrl: './form-modal.component.html',
    styleUrls: ['./form-modal.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormModalComponent implements OnInit {
    public logWorkForm: FormGroup;
    public chosenDate: string;

    constructor(private modalController: ModalController) {}

    ngOnInit() {
        this.initForm();
    }

    public onSubmit() {
        console.log('submit: ', this.logWorkForm.value);
        this.modalController.dismiss({
            dismissed: true,
            formValue: this.logWorkForm.value,
        });
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
