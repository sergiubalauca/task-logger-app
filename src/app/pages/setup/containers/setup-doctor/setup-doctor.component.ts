import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    inject,
} from '@angular/core';
import {
    Doctor,
    FormCanDeactivateService,
    ItemSlidingCardComponent,
    ItemSlidingProps,
    ModalService,
} from '@shared';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { firstValueFrom, map, Observable, take } from 'rxjs';
import { AddEditDoctorComponent } from './add-edit-doctor.ts/add-edit-doctor.component';
import { DoctorApiServce, DoctorFacade } from '@abstraction';

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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetupDoctorComponent implements OnInit {
    public doctors$: Observable<ItemSlidingProps[]>;
    private formCanDeactivateService: FormCanDeactivateService = inject(
        FormCanDeactivateService
    );

    constructor(
        private readonly doctorFacade: DoctorFacade,
        private readonly modalService: ModalService,
        private readonly doctorApiService: DoctorApiServce
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
            true,
            this.formCanDeactivateService.canDeactivateFn
        );

        const modalData = await this.modalService.onDidDismiss();

        if (modalData.data && modalData.data.dismissed) {
            const apiDoc = await firstValueFrom(
                this.doctorApiService
                    .createDoctor(modalData.data.doctor)
                    .pipe(take(1))
            );

            await this.doctorFacade.addOne({
                ...modalData.data.doctor,
                mongoId: apiDoc?._id ?? '',
            });
        }
    }

    public async deleteDoctor(doctorId: number): Promise<void> {
        const rxdbDoctor = await this.doctorFacade.getOne({
            id: doctorId.toString(),
        });

        await firstValueFrom(
            this.doctorApiService.deleteDoctor(rxdbDoctor.mongoId).pipe(take(1))
        );
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
            true,
            this.formCanDeactivateService.canDeactivateFn
        );

        const modalData = await this.modalService.onDidDismiss();

        if (modalData.data && modalData.data.dismissed) {
            const doctorToEdit: Doctor = {
                ...modalData.data.doctor,
                id: doctorId.toString(),
            };
            await this.doctorFacade.editOne(doctorToEdit);
            await firstValueFrom(
                this.doctorApiService
                    .updateDoctor({ ...doctorToEdit, id: doctor.mongoId })
                    .pipe(take(1))
            );
        }
    }
}
