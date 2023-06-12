import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Doctor, HeaderComponent, ModalService } from '@shared';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { DoctorRepository } from '@database';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

@Component({
    selector: 'app-add-edit-doctor',
    templateUrl: './add-edit-doctor.component.html',
    styleUrls: ['./add-edit-doctor.component.scss'],
    standalone: true,
    imports: [
        IonicModule,
        CommonModule,
        HeaderComponent,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [DoctorRepository, ModalService, ModalController],
})
export class AddEditDoctorComponent implements OnInit {
    public doctorForm: FormGroup;
    @Input() private doctor: Doctor;

    private readonly modalCtrl: ModalController = inject(ModalController);
    constructor(
        // private readonly modalCtrl: ModalController,
        private formBuilder: FormBuilder
    ) {}

    public ngOnInit(): void {
        this.doctorForm = this.formBuilder.group({
            name: new FormControl<string>(this.doctor ? this.doctor.name : '', Validators.required),
            phone: new FormControl<string>(this.doctor ? this.doctor.phone : '', Validators.required),
        });
    }

    public async onSubmit(): Promise<boolean> {
        return await this.modalCtrl.dismiss(
            {
                doctor: this.doctorForm.value,
                dismissed: true,
            },
            'Save'
        );
    }
}
