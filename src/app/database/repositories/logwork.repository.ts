import { Injectable } from '@angular/core';
import { LOGWORK_COLLECTION_NAME } from '@shared';
import { RxDocument } from 'rxdb';
import { Observable } from 'rxjs';
import { DailyWork } from 'src/app/shared/models/dailyWork';
import { RxDatabaseProvider } from '../rx-database.provider';
import { RxLogWorkDocumentType } from '../schemas';

@Injectable()
export class LogWorkRepository {
    constructor(private readonly databaseProvider: RxDatabaseProvider) {}

    public getDailyWork$(docId: string): Observable<RxLogWorkDocumentType> {
        const database = this.databaseProvider.rxDatabaseInstance;
        if (database) {
            const logWorkCollection =
                this.databaseProvider?.rxDatabaseInstance.logwork;
            return logWorkCollection.findOne().where('id').eq(docId).$;
        }
    }

    public async editDailyWork(
        dailyWork: DailyWork,
        dailyId: string
    ): Promise<void> {
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
}
