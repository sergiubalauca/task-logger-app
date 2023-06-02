import { Component, OnInit } from '@angular/core';
import { Doctor, ModalService } from '@shared';
import { CommonModule, NgFor } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { DoctorRepository } from '@database';
import { Observable } from 'rxjs';
import { AddEditDoctorComponent } from './add-edit-doctor.ts/add-edit-doctor.component';

@Component({
    selector: 'app-setup-doctor',
    templateUrl: './setup-doctor.component.html',
    styleUrls: ['./setup-doctor.component.scss'],
    standalone: true,
    imports: [
        HeaderComponent,
        IonicModule,
        CommonModule,
        AddEditDoctorComponent,
    ],
    providers: [DoctorRepository, ModalService],
})
export class SetupDoctorComponent implements OnInit {
    public doctors$: Observable<Doctor[]>;

    constructor(
        private readonly doctorRepository: DoctorRepository,
        private readonly modalService: ModalService
    ) {}

    ngOnInit() {
        this.doctors$ = this.doctorRepository.getAll$();
    }

    public async addDoctor(): Promise<void> {
        await this.modalService.createAndShow(
            AddEditDoctorComponent,
            '',
            {},
            true
        );

        const modalData = await this.modalService.onDidDismiss();

        console.log('GSB modal data: ', modalData);

        if (modalData.data && modalData.data.dismissed) {
            this.doctorRepository.addDoctor(modalData.data.doctor);
        }
    }

    public deleteDoctor(doctor: Doctor): void {
        this.doctorRepository.deleteDoctor(doctor);
    }

    public async editDoctor(doctor: Doctor): Promise<void> {
        await this.modalService.createAndShow(
            AddEditDoctorComponent,
            '',
            {
                doctor,
            },
            true
        );

        const modalData = await this.modalService.onDidDismiss();

        if (modalData.data && modalData.data.dismissed) {
            const doctorToEdit = {
                ...modalData.data.doctor,
                id: doctor.id,
            };
            this.doctorRepository.editDoctor(doctorToEdit);
        }
    }
}
