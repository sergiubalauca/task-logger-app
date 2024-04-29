import {
    AfterContentChecked,
    ChangeDetectionStrategy,
    Component,
    OnInit,
    inject,
} from '@angular/core';
import {
    DailyWork,
    DateTimeService,
    FormCanDeactivateService,
    ModalService,
} from '@shared';
import { SwiperComponent } from './swiper/swiper.component';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { LogWorkApiService, LogWorkFacade } from '@abstraction';
import {
    Observable,
    distinctUntilChanged,
    firstValueFrom,
    map,
    of,
    switchMap,
} from 'rxjs';
import { StateSubject } from './form/custom-state/models';
import { CommonModule } from '@angular/common';
import {
    DatetimeChangeEventDetail,
    DatetimeHighlight,
    IonDatetimeCustomEvent,
} from '@ionic/core';
import { DoctorRepository, WorkItemRepository } from '@database';

@Component({
    selector: 'app-log-work',
    templateUrl: './log-work.component.html',
    styleUrls: ['./log-work.component.scss'],
    standalone: true,
    imports: [HeaderComponent, IonicModule, CommonModule],
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogWorkComponent implements OnInit, AfterContentChecked {
    public newMonthChangedEvent: StateSubject<string[]> = new StateSubject([]);
    public highlightedDates$: Observable<DatetimeHighlight[]>;
    private formCanDeactivateService: FormCanDeactivateService = inject(
        FormCanDeactivateService
    );

    constructor(
        private modalService: ModalService,
        private logWorkFacade: LogWorkFacade,
        private dateTimeService: DateTimeService,
        private logWorkApiService: LogWorkApiService,
        private workItemRepository: WorkItemRepository,
        private doctorRepository: DoctorRepository
    ) {}

    ngOnInit() {
        this.highlightedDates$ = this.newMonthChangedEvent.pipe(
            distinctUntilChanged((a, b) => {
                return JSON.stringify(a) === JSON.stringify(b);
            }),
            switchMap((datesToQuery) => {
                if (!datesToQuery || datesToQuery.length === 0) {
                    return of([]);
                }

                return this.logWorkFacade
                    .getManyByCondition(
                        datesToQuery.map((date) => ({ id: date }))
                    )
                    .pipe(
                        map((docs) => {
                            if (!docs || docs.length === 0) {
                                return [];
                            }

                            return docs.map((doc) => {
                                const day = doc.id
                                    .split('-')[0]
                                    .padStart(2, '0');
                                const month = doc.id
                                    .split('-')[1]
                                    .padStart(2, '0');
                                const year = doc.id.split('-')[2];

                                const date = `${year}-${month}-${day}`;

                                switch (doc.isPartiallySaved) {
                                    case true:
                                        return {
                                            date,
                                            textColor: 'rgb(68, 10, 184)',
                                            backgroundColor: 'rgb(255, 255, 0)',
                                        };
                                    case false:
                                        return {
                                            date,
                                            textColor: 'rgb(68, 10, 184)',
                                            backgroundColor:
                                                'rgb(215, 400, 229)',
                                        };
                                }
                            });
                        })
                    );
            })
        );
    }

    ngAfterContentChecked() {
        this.observeDatetimeMonthChange();
    }

    public async selectDate(
        event: IonDatetimeCustomEvent<DatetimeChangeEventDetail>
    ) {
        const chosenDate = event.detail.value as string;

        await this.modalService.createAndShow(
            SwiperComponent,
            '',
            {
                chosenDate,
            },
            true,
            this.formCanDeactivateService.canDeactivateFn
        );

        const modalData = await this.modalService.onDidDismiss();

        const docId = this.dateTimeService.getDailyWorkId(new Date(chosenDate));
        if (modalData.data) {
            if (modalData.data.isDelete) {
                const mongoIdOfDoc =
                    (await this.logWorkFacade.getOne({ id: docId })).mongoId ??
                    null;
                await firstValueFrom(
                    this.logWorkApiService.deleteDailyWork(mongoIdOfDoc)
                );
                await this.logWorkFacade.deleteOne({ id: docId });
            } else {
                const isFormValid = modalData.data.dismissed;
                const dailyWork: DailyWork = {
                    ...modalData.data.formValue,
                    id: docId,
                    isPartiallySaved: !isFormValid,
                };

                await this.mapWorkItemsAndDoctorsNameToId(dailyWork);

                const apiDoc = await firstValueFrom(
                    this.logWorkApiService.createDailyWork(dailyWork)
                );

                await this.logWorkFacade.editOne({
                    dailyWork: {
                        ...modalData.data.formValue,
                        isPartiallySaved: !isFormValid,
                    },
                    dailyId: docId,
                    mongoId: apiDoc._id,
                });
            }
        }
    }

    private async mapWorkItemsAndDoctorsNameToId(
        dailyWork: DailyWork
    ): Promise<DailyWork> {
        const workItems: string[] = dailyWork.doctorGroup.doctorArray
            .map((doctor) => {
                return doctor.patientGroup.patientArray.map((patient) => {
                    return patient.workItemGroup.workItemProps.map(
                        (workItem) => {
                            return workItem.workItem;
                        }
                    );
                });
            })
            .flat(2);

        const doctors: string[] = dailyWork.doctorGroup.doctorArray.map(
            (doctor) => doctor.doctor
        );

        const doctorsIdToName: Map<string, string> = new Map();

        for (const doctor of doctors) {
            const doctorDoc = await this.doctorRepository.getOneByName({
                name: doctor,
            });

            if (!doctorDoc) {
                continue;
            }
            doctorsIdToName.set(doctor, doctorDoc.mongoId);
        }

        const workItemsIdToName: Map<string, string> = new Map();
        for (const workItem of workItems) {
            const workItemDoc = await this.workItemRepository.getOneByName({
                name: workItem,
            });

            if (!workItemDoc) {
                continue;
            }
            workItemsIdToName.set(workItem, workItemDoc.mongoId);
        }

        dailyWork.doctorGroup.doctorArray.forEach((doctor) => {
            doctor.mongoId = doctorsIdToName.get(doctor.doctor) ?? '';
            doctor.patientGroup.patientArray.forEach((patient) => {
                patient.workItemGroup.workItemProps.forEach((workItem) => {
                    workItem.mongoId =
                        workItemsIdToName.get(workItem.workItem) ?? '';
                });
            });
        });

        return dailyWork;
    }

    private observeDatetimeMonthChange() {
        const daysInMonth: Map<string, number[]> = new Map([
            ['January', Array.from(Array(31).keys())],
            [
                'February',
                this.dateTimeService.isLeapYear()
                    ? Array.from(Array(29).keys())
                    : Array.from(Array(28).keys()),
            ],
            ['March', Array.from(Array(31).keys())],
            ['April', Array.from(Array(30).keys())],
            ['May', Array.from(Array(31).keys())],
            ['June', Array.from(Array(30).keys())],
            ['July', Array.from(Array(31).keys())],
            ['August', Array.from(Array(31).keys())],
            ['September', Array.from(Array(30).keys())],
            ['October', Array.from(Array(31).keys())],
            ['November', Array.from(Array(30).keys())],
            ['December', Array.from(Array(31).keys())],
        ]);

        const monthsNameToNumber: Map<string, number> = new Map([
            ['January', 1],
            ['February', 2],
            ['March', 3],
            ['April', 4],
            ['May', 5],
            ['June', 6],
            ['July', 7],
            ['August', 8],
            ['September', 9],
            ['October', 10],
            ['November', 11],
            ['December', 12],
        ]);

        let previous = '';
        let datesToQuery: string[] = [];

        const targetNode = document.querySelector('ion-datetime');
        const config: MutationObserverInit = {
            attributes: true,
            childList: true,
            subtree: true,
        };
        const callbackProcess = (
            mutationsList: { type: string }[],
            _observer: unknown
        ): string[] => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes') {
                    const e = document
                        .querySelector('ion-datetime')
                        ?.shadowRoot?.querySelector('button')?.textContent;
                    if (e && e !== previous) {
                        previous = e;

                        const days = daysInMonth.get(e?.split(' ')[0]);
                        const year = e?.split(' ')[1];

                        datesToQuery = days?.map((day) => {
                            const date = `${day + 1}-${monthsNameToNumber.get(
                                e?.split(' ')[0]
                            )}-${year}`;
                            return date;
                        });

                        this.newMonthChangedEvent.next(datesToQuery);

                        return datesToQuery;
                    }
                }
            }
        };

        const observer = new MutationObserver(callbackProcess);
        observer.observe(targetNode, config);
    }
}
