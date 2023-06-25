import { Component, OnInit } from '@angular/core';
import {
    Doctor,
    ItemSlidingCardComponent,
    ItemSlidingProps,
    ModalService,
} from '@shared';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { map, Observable } from 'rxjs';
import { AddEditDoctorComponent } from './add-edit-doctor.ts/add-edit-doctor.component';
import { DoctorFacade } from '@abstraction';

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
        ItemSlidingCardComponent,
    ],
    providers: [ModalService],
})
export class SetupDoctorComponent implements OnInit {
    public doctors$: Observable<ItemSlidingProps[]>;

    constructor(
        private readonly doctorFacade: DoctorFacade,
        private readonly modalService: ModalService
    ) {}

    ngOnInit() {
        this.doctors$ = this.doctorFacade.getAll$().pipe(
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
            this.doctorFacade.addOne(modalData.data.doctor);
        }
    }

    public async deleteDoctor(doctorId: number): Promise<void> {
        await this.doctorFacade.deleteOne({ id: doctorId.toString() });
    }

    public async editDoctor(doctorId: number): Promise<void> {
        const doctor = await this.doctorFacade.getOne({
            id: doctorId.toString(),
        });
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
            const doctorToEdit: Doctor = {
                ...modalData.data.doctor,
                id: doctor.id,
            };
            await this.doctorFacade.editOne(doctorToEdit);
        }
    }
}
