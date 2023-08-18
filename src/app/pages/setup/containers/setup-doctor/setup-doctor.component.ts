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
import { map, Observable, take } from 'rxjs';
import { AddEditDoctorComponent } from './add-edit-doctor.ts/add-edit-doctor.component';
import { DoctorApiServce, DoctorFacade } from '@abstraction';
import { ConnectivityStateService } from '@core';

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
    providers: [ModalService, DoctorApiServce],
})
export class SetupDoctorComponent implements OnInit {
    public doctors$: Observable<ItemSlidingProps[]>;
    public isOffline$ = this.connectivityStateService.connectivity$.pipe(map((status) => status));
    constructor(
        private readonly doctorFacade: DoctorFacade,
        private readonly modalService: ModalService,
        private readonly doctorApiService: DoctorApiServce,
        private readonly connectivityStateService: ConnectivityStateService
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

        if (modalData.data && modalData.data.dismissed) {
            await this.doctorFacade.addOne(modalData.data.doctor);
            this.doctorApiService.createDoctor(modalData.data.doctor).pipe(take(1)).subscribe();
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
