import { Injectable } from '@angular/core';
import { CRUDParams, DailyWork, DailyWorkDoc } from '@shared';
import { DeepReadonlyObject } from 'rxdb';
import { map, Observable } from 'rxjs';
import { RxDatabaseProvider } from '../rx-database.provider';
import { RxLogWorkDocumentType } from '../schemas';

@Injectable()
export class LogWorkRepository {
    constructor(private readonly databaseProvider: RxDatabaseProvider) {}

    public getOne$(
        params: Pick<CRUDParams, 'id'>
    ): Observable<DeepReadonlyObject<DailyWorkDoc>> {
        const database = this.databaseProvider.rxDatabaseInstance;
        if (database) {
            const logWorkCollection =
                this.databaseProvider?.rxDatabaseInstance.logwork;
            const logWork: Observable<DailyWorkDoc> = logWorkCollection
                .findOne()
                .where('id')
                .eq('Wed, 21 Jun 2023 19:54:00 GMT').$;

            return logWork.pipe(
                map((doc) => doc as DeepReadonlyObject<DailyWorkDoc>)
            );
        }

        return new Observable<DeepReadonlyObject<DailyWorkDoc>>();
    }

    public async editOne(data: {
        dailyWork: DailyWork;
        dailyId: string;
    }): Promise<void> {
        const { dailyWork, dailyId } = data;
        const database = this.databaseProvider.rxDatabaseInstance;

        if (database) {
            const logWorkCollection =
                this.databaseProvider?.rxDatabaseInstance.logwork;

            const workItemToUpdate1: RxLogWorkDocumentType = {
                doctorGroup: [],
                id: dailyId,
                endTime: '',
                startTime: '',
            };

            workItemToUpdate1.doctorGroup.push(
                ...dailyWork.doctorGroup.doctorArray.map((doctor) => ({
                    doctor: {
                        name: doctor.doctor.value,
                        pacient: doctor.patientGroup.patientArray.map(
                            (patient) => ({
                                name: patient.patient,
                                workItemAndNumber:
                                    patient.workItemGroup.workItemAndNumber.map(
                                        (workItem) => ({
                                            workItem: {
                                                name: workItem.workItem.value,
                                            },
                                            numberOfWorkItems:
                                                workItem.numberOfWorkItems.toString(),
                                        })
                                    ),
                            })
                        ),
                    },
                }))
            );

            workItemToUpdate1.startTime = dailyWork.timeGroup.startTime;
            workItemToUpdate1.endTime = dailyWork.timeGroup.endTime;

            await logWorkCollection.upsert({
                ...workItemToUpdate1,
            });
            // const workItemToUpdate = await logWorkCollection
            //     .findOne()
            //     .where('id')
            //     .eq(dailyWork.id)
            //     .exec();

            // if (!workItemToUpdate) {
            //     await logWorkCollection.upsert({
            //         ...workItemToUpdate1,
            //     });
            // }
        }
    }

    public async getOne(params: Pick<CRUDParams, 'id'>) {
        const database = this.databaseProvider.rxDatabaseInstance;

        if (database && params.id) {
            const docCollection =
                this.databaseProvider?.rxDatabaseInstance.logwork;
            const workItem: any = await docCollection
                .findOne()
                .where('id')
                .eq(params.id.toString())
                .exec();

            return workItem;
        }

        return null;
    }

    public async addOne(workItem: any): Promise<void> {
        console.log('Method not implemented');
    }

    public async deleteOne(params: Pick<CRUDParams, 'id'>) {
        console.log('Method not implemented');
    }

    public getAll$() {
        const database = this.databaseProvider.rxDatabaseInstance;

        if (database) {
            return database.logwork.find().$;
        }

        return null;
    }
}
