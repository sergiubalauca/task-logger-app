import { Injectable, inject } from '@angular/core';
import { CRUDParams, Doctor } from '@shared';
import { DeepReadonlyObject, RxDocument } from 'rxdb';
import { Observable } from 'rxjs';
import { RxDatabaseProvider } from '../rx-database.provider';
import { RxDoctorDocumentType } from '../schemas';
import { LogWorkRepository } from './logwork.repository';

@Injectable()
export class DoctorRepository {
    private readonly logWorkRepository = inject(LogWorkRepository);

    constructor(private readonly databaseProvider: RxDatabaseProvider) {}

    public async getOneByName(
        params: Pick<CRUDParams, 'name'>
    ): Promise<DeepReadonlyObject<Doctor>> {
        const database = this.databaseProvider.rxDatabaseInstance;

        if (database && params.name) {
            const docCollection =
                this.databaseProvider?.rxDatabaseInstance.doctor;
            const doctorToUpdate: Doctor = await docCollection
                .findOne()
                .where('name')
                .eq(params.name)
                .exec();

            const res = doctorToUpdate as DeepReadonlyObject<Doctor>;
            return res ?? null;
        }

        return null;
    }

    public async getOneByNameWithDifferentId(
        params: Pick<CRUDParams, 'name' | 'id'>
    ): Promise<DeepReadonlyObject<Doctor>> {
        const database = this.databaseProvider.rxDatabaseInstance;

        if (database && params.name) {
            const docCollection =
                this.databaseProvider?.rxDatabaseInstance.doctor;
            const doctorToUpdate: Doctor = await docCollection
                .findOne()
                .where('name')
                .eq(params.name)
                .where('id')
                .ne(params.id)
                .exec();

            const res = doctorToUpdate as DeepReadonlyObject<Doctor>;
            return res ?? null;
        }

        return null;
    }

    public async getOne(
        params: Pick<CRUDParams, 'id'>
    ): Promise<DeepReadonlyObject<Doctor>> {
        const database = this.databaseProvider.rxDatabaseInstance;
        if (database && params.id) {
            const docCollection =
                this.databaseProvider?.rxDatabaseInstance.doctor;
            const doc: RxDocument = await docCollection
                .findOne()
                .where('id')
                .eq(params.id)
                .exec();

            const res = doc.toJSON() as DeepReadonlyObject<Doctor>;
            return res ?? null;
        }

        return null;
    }

    public getAll$(): Observable<RxDoctorDocumentType[]> {
        const database = this.databaseProvider.rxDatabaseInstance;
        if (database) {
            return database.doctor.find().$;
        }
        return null;
    }

    // gsb solve this any issue, use appropriate type
    public async addOne(doctor: any): Promise<void> {
        const database = this.databaseProvider.rxDatabaseInstance;

        const alreadyExistingDoctor = await this.getOneByName({
            name: doctor.name,
        });

        if (alreadyExistingDoctor) {
            throw new Error('Doctor already exists');
        }

        if (database && !alreadyExistingDoctor) {
            const docCollection =
                this.databaseProvider?.rxDatabaseInstance.doctor;

            // eslint-disable-next-line @typescript-eslint/dot-notation
            await docCollection.insert({
                ...doctor,
                // generate random id based on timestamp
                id: new Date().getTime().toString(),
            });
        }
    }

    public async editOne(doctor: Doctor): Promise<void> {
        const database = this.databaseProvider.rxDatabaseInstance;

        const alreadyExistingDoctor = await this.getOneByNameWithDifferentId({
            name: doctor.name,
            id: doctor.id,
        });

        if (alreadyExistingDoctor) {
            throw new Error('Doctor already exists');
        }

        if (database && !alreadyExistingDoctor) {
            const docCollection =
                this.databaseProvider?.rxDatabaseInstance.doctor;
            const docToUpdate: RxDocument = await docCollection
                .findOne()
                .where('id')
                .eq(doctor.id)
                .exec();

            if (docToUpdate) {
                await this.logWorkRepository.updateLogWorksWithDoctor(
                    docToUpdate.toJSON() as Doctor,
                    doctor
                );

                await docToUpdate.incrementalPatch({
                    ...doctor,
                });
            }
        }

        return null;
    }

    public async deleteOne(params: Pick<CRUDParams, 'id'>): Promise<void> {
        const database = this.databaseProvider.rxDatabaseInstance;
        if (database && params.id) {
            const docCollection =
                this.databaseProvider?.rxDatabaseInstance.doctor;
            const doctorToDelete: RxDocument = await docCollection
                .findOne()
                .where('id')
                .eq(params.id.toString())
                .exec();

            if (doctorToDelete) {
                doctorToDelete.remove();
            }
        }
    }

    public async deleteAll(): Promise<void> {
        const database = this.databaseProvider.rxDatabaseInstance;

        if (database) {
            const docCollection =
                this.databaseProvider?.rxDatabaseInstance.doctor;
            const doctorsToDelete: RxDocument[] = await docCollection
                .find()
                .exec();

            if (doctorsToDelete && doctorsToDelete.length) {
                for (const doctor of doctorsToDelete) {
                    await doctor.remove();
                }
            }
        }
    }
}
