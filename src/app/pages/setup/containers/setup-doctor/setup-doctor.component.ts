import { Component, OnInit } from '@angular/core';
import { Doctor, ItemSlidingCardComponent, ItemSlidingProps, ModalService } from '@shared';
import { CommonModule, NgFor } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { DoctorRepository } from 'src/app/core/database';
import { map, Observable } from 'rxjs';
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
        ItemSlidingCardComponent
    ],
    providers: [DoctorRepository, ModalService],
})
export class SetupDoctorComponent implements OnInit {
    public doctors$: Observable<ItemSlidingProps[]>;

    constructor(
        private readonly doctorRepository: DoctorRepository,
        private readonly modalService: ModalService
    ) {}

    ngOnInit() {
        this.doctors$ = this.doctorRepository.getAll$().pipe(
            map((doctors: Doctor[]) =>
                doctors.map((doctor: Doctor) => {
                    const itemSlidingProp: ItemSlidingProps = {
                        id: Number(doctor.id),
                        title: doctor.name,
                        rows: [`Phone: ${doctor.phone}`],
                    };
                    return itemSlidingProp;
                })
            )
        );
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

    public async deleteDoctor(doctorId: number): Promise<void> {
        await this.doctorRepository.deleteDoctor(doctorId);
    }

    public async editDoctor(doctorId: number): Promise<void> {
        const doctor = await this.doctorRepository.getOne$(doctorId);
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
                id: doctorId,
            };
            this.doctorRepository.editDoctor(doctorToEdit);
        }
    }
}
