import { Injectable } from '@angular/core';
import { CRUDParams, DailyWork, DailyWorkDoc, Doctor, WorkItem } from '@shared';
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
            const logWork: Observable<RxDocument[]> = logWorkCollection
                .find()
                .where('id')
                .eq(params.id).$;

            return logWork.pipe(
                map((docs) => {
                    const doc = docs[0];
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
        mongoId?: string;
    }): Promise<void> {
        const { dailyWork, dailyId, mongoId } = data;
        const database = this.databaseProvider.rxDatabaseInstance;

        if (database) {
            const logWorkCollection =
                this.databaseProvider?.rxDatabaseInstance.logwork;

            const workItemToUpdate1: RxLogWorkDocumentType = {
                doctorGroup: [],
                id: dailyId,
                endTime: '',
                startTime: '',
                breaks: [],
                mongoId: '',
                isPartiallySaved: data.dailyWork.isPartiallySaved,
            };

            workItemToUpdate1.doctorGroup.push(
                ...dailyWork.doctorGroup.doctorArray.map((doctor) => ({
                    doctor: {
                        mongoId: doctor.mongoId,
                        name: doctor.doctor,
                        pacient: doctor.patientGroup.patientArray.map(
                            (patient) => ({
                                name: patient.patient,
                                workItemProps:
                                    patient.workItemGroup.workItemProps.map(
                                        (workItem) => ({
                                            workItem: {
                                                name: workItem.workItem,
                                                mongoId: workItem.mongoId,
                                            },
                                            numberOfWorkItems:
                                                workItem?.numberOfWorkItems?.toString() ??
                                                '',
                                            color: workItem.color,
                                            comment: workItem.comment,
                                        })
                                    ),
                            })
                        ),
                    },
                }))
            );

            workItemToUpdate1.startTime = dailyWork.timeGroup.startTime;
            workItemToUpdate1.endTime = dailyWork.timeGroup.endTime;
            workItemToUpdate1.breaks = dailyWork.timeGroup.breaks;
            workItemToUpdate1.mongoId = mongoId;

            await logWorkCollection.upsert({
                ...workItemToUpdate1,
            });
        }
    }

    public async updateLogWorksWithService(
        oldWorkItem: WorkItem,
        newWorkItem: WorkItem
    ) {
        const database = this.databaseProvider.rxDatabaseInstance;

        if (database) {
            const logWorkCollection =
                this.databaseProvider?.rxDatabaseInstance.logwork;

            const logWorkToUpdate = await this.getAll();
            const logWorksLinkedToWorkItem = logWorkToUpdate.filter(
                (logWork) => {
                    return logWork.doctorGroup.map((doctor) => {
                        return doctor.doctor.pacient.map((patient) => {
                            return patient.workItemProps.map((workItemProp) => {
                                return (
                                    workItemProp.workItem === oldWorkItem.name
                                );
                            });
                        });
                    });
                }
            );

            for (const logWork of logWorksLinkedToWorkItem) {
                let canUpdate = false;

                const workItemToUpdate: RxLogWorkDocumentType = {
                    doctorGroup: Array.from(logWork.doctorGroup).map(
                        (doctor) => {
                            return {
                                doctor: {
                                    name: doctor.doctor.name,
                                    mongoId: doctor.doctor.mongoId,

                                    pacient: Array.from(
                                        doctor.doctor.pacient
                                    ).map((patient) => {
                                        return {
                                            name: patient.name,
                                            workItemProps: Array.from(
                                                patient.workItemProps
                                            ).map((workItemProp) => {
                                                if (
                                                    workItemProp.workItem
                                                        .mongoId ===
                                                    oldWorkItem.mongoId
                                                ) {
                                                    canUpdate = true;
                                                    return {
                                                        workItem: {
                                                            name: newWorkItem.name,
                                                            mongoId:
                                                                workItemProp
                                                                    .workItem
                                                                    .mongoId,
                                                        },
                                                        numberOfWorkItems:
                                                            workItemProp.numberOfWorkItems,
                                                        color: workItemProp.color,
                                                        comment:
                                                            workItemProp.comment,
                                                    };
                                                }
                                                return {
                                                    workItem: {
                                                        name: workItemProp
                                                            .workItem.name,
                                                        mongoId:
                                                            workItemProp
                                                                .workItem
                                                                .mongoId,
                                                    },
                                                    numberOfWorkItems:
                                                        workItemProp.numberOfWorkItems,
                                                    color: workItemProp.color,
                                                    comment:
                                                        workItemProp.comment,
                                                };
                                            }),
                                        };
                                    }),
                                },
                            };
                        }
                    ),
                    id: logWork.id,
                    endTime: logWork.endTime,
                    startTime: logWork.startTime,
                    breaks: Array.from(logWork.breaks),
                    mongoId: logWork.mongoId,
                    isPartiallySaved: logWork.isPartiallySaved,
                };

                if (canUpdate) {
                    await logWorkCollection.upsert({
                        ...workItemToUpdate,
                    });
                }
            }
        }
    }

    public async updateLogWorksWithDoctor(
        oldDoctor: Doctor,
        newDoctor: Doctor
    ) {
        const database = this.databaseProvider.rxDatabaseInstance;

        if (database) {
            const logWorkCollection =
                this.databaseProvider?.rxDatabaseInstance.logwork;

            const logWorkToUpdate = await this.getAll();
            const logWorksLinkedToWorkItem = logWorkToUpdate.filter(
                (logWork) => {
                    return logWork.doctorGroup.map((doctor) => {
                        return doctor.doctor.name === oldDoctor.name;
                    });
                }
            );

            for (const logWork of logWorksLinkedToWorkItem) {
                let canUpdate = false;

                const workItemToUpdate: RxLogWorkDocumentType = {
                    doctorGroup: Array.from(logWork.doctorGroup).map(
                        (doctor) => {
                            if (doctor.doctor.mongoId === oldDoctor.mongoId) {
                                canUpdate = true;

                                return {
                                    doctor: {
                                        name: newDoctor.name,
                                        mongoId: doctor.doctor.mongoId,

                                        pacient: Array.from(
                                            doctor.doctor.pacient
                                        ).map((patient) => {
                                            return {
                                                name: patient.name,
                                                workItemProps: Array.from(
                                                    patient.workItemProps
                                                ).map((workItemProp) => {
                                                    return {
                                                        workItem: {
                                                            name: workItemProp
                                                                .workItem.name,
                                                            mongoId:
                                                                workItemProp
                                                                    .workItem
                                                                    .mongoId,
                                                        },
                                                        numberOfWorkItems:
                                                            workItemProp.numberOfWorkItems,
                                                        color: workItemProp.color,
                                                        comment:
                                                            workItemProp.comment,
                                                    };
                                                }),
                                            };
                                        }),
                                    },
                                };
                            }
                            return {
                                doctor: {
                                    name: doctor.doctor.name,
                                    pacient: Array.from(
                                        doctor.doctor.pacient
                                    ).map((patient) => {
                                        return {
                                            name: patient.name,
                                            workItemProps: Array.from(
                                                patient.workItemProps
                                            ).map((workItemProp) => {
                                                return {
                                                    workItem: {
                                                        name: workItemProp
                                                            .workItem.name,
                                                        mongoId:
                                                            workItemProp
                                                                .workItem
                                                                .mongoId,
                                                    },
                                                    numberOfWorkItems:
                                                        workItemProp.numberOfWorkItems,
                                                    color: workItemProp.color,
                                                    comment:
                                                        workItemProp.comment,
                                                };
                                            }),
                                        };
                                    }),
                                },
                            };
                        }
                    ),
                    id: logWork.id,
                    endTime: logWork.endTime,
                    startTime: logWork.startTime,
                    breaks: Array.from(logWork.breaks),
                    mongoId: logWork.mongoId,
                    isPartiallySaved: logWork.isPartiallySaved,
                };

                if (canUpdate) {
                    await logWorkCollection.upsert({
                        ...workItemToUpdate,
                    });
                }
            }
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
        const database = this.databaseProvider.rxDatabaseInstance;

        if (database) {
            const docCollection =
                this.databaseProvider?.rxDatabaseInstance.logwork;
            const workItem: RxDocument = await docCollection
                .findOne()
                .where('id')
                .eq(params.id.toString())
                .exec();

            if (workItem) {
                workItem.remove();
            }
        }
    }

    public getAll$() {
        const database = this.databaseProvider.rxDatabaseInstance;

        if (database) {
            return database.logwork.find().$;
        }

        return null;
    }

    public async getAll(): Promise<DeepReadonlyObject<DailyWorkDoc>[]> {
        const database = this.databaseProvider.rxDatabaseInstance;

        if (database) {
            const docCollection =
                this.databaseProvider?.rxDatabaseInstance.logwork;
            const logworks: RxDocument[] = await docCollection.find().exec();

            return logworks.map(
                (workItem) =>
                    workItem.toJSON() as DeepReadonlyObject<DailyWorkDoc>
            );
        }

        return null;
    }

    public async deleteAll(): Promise<void> {
        const database = this.databaseProvider.rxDatabaseInstance;

        if (database) {
            const docCollection =
                this.databaseProvider?.rxDatabaseInstance.logwork;
            const logworks: RxDocument[] = await docCollection.find().exec();

            if (logworks) {
                logworks.forEach((workItem) => {
                    workItem.remove();
                });
            }
        }
    }

    public getManyByCondition(
        params: Pick<CRUDParams, 'id'>[]
    ): Observable<DeepReadonlyObject<DailyWorkDoc>[]> {
        const database = this.databaseProvider.rxDatabaseInstance;

        if (database && params && params.length > 0) {
            const docCollection =
                this.databaseProvider?.rxDatabaseInstance.logwork;

            const logWorks: Observable<RxDocument[]> = docCollection
                .find()
                .where('id')
                .in(params.map((param) => param.id.toString())).$;

            return logWorks.pipe(
                map((docs) => {
                    return docs.map(
                        (doc) =>
                            doc.toJSON() as DeepReadonlyObject<DailyWorkDoc>
                    );
                })
            );
        }

        return null;
    }
}
