import { Injectable } from '@angular/core';
import { CRUDParams, DailyWork, DailyWorkDoc } from '@shared';
import { DeepReadonlyObject, RxDocument } from 'rxdb';
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
            const logWork: Observable<RxDocument> = logWorkCollection
                .findOne()
                .where('id')
                .eq(params.id).$;

            return logWork.pipe(
                map((doc) => {
                    const res =
                        doc?.toJSON() as DeepReadonlyObject<DailyWorkDoc>;
                    return res ?? null;
                })
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
                        name: doctor.doctor,
                        pacient: doctor.patientGroup.patientArray.map(
                            (patient) => ({
                                name: patient.patient,
                                workItemAndNumber:
                                    patient.workItemGroup.workItemAndNumber.map(
                                        (workItem) => ({
                                            workItem: {
                                                name: workItem.workItem,
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

    public async getOne(
        params: Pick<CRUDParams, 'id'>
    ): Promise<DeepReadonlyObject<DailyWorkDoc>> {
        const database = this.databaseProvider.rxDatabaseInstance;

        if (database && params.id) {
            const docCollection =
                this.databaseProvider?.rxDatabaseInstance.logwork;
            const workItem: RxDocument = await docCollection
                .findOne()
                .where('id')
                .eq(params.id.toString())
                .exec();

            const res = workItem.toJSON() as DeepReadonlyObject<DailyWorkDoc>;
            return res ?? null;
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
