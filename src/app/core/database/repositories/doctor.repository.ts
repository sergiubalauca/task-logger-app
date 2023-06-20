import { Injectable } from '@angular/core';
import { Doctor } from '@shared';
import { DeepReadonlyObject, RxCollection, RxDocument } from 'rxdb';
import { Observable } from 'rxjs';
import { RxDatabaseProvider } from '../rx-database.provider';
import { RxDoctorDocumentType } from '../schemas';

@Injectable()
export class DoctorRepository {
    constructor(private readonly databaseProvider: RxDatabaseProvider) {}

    public async getOne$(id: number): Promise<DeepReadonlyObject<Doctor>> {
        const database = this.databaseProvider.rxDatabaseInstance;
        if (database && id) {
            const docCollection =
                this.databaseProvider?.rxDatabaseInstance.doctor;
            const docToUpdate: RxDocument = await docCollection
                .findOne()
                .where('id')
                .eq(id.toString())
                .exec();

            const res = docToUpdate.toJSON() as DeepReadonlyObject<Doctor>;
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
    public async addDoctor(doctor: any): Promise<void> {
        const database = this.databaseProvider.rxDatabaseInstance;
        if (database) {
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

    public async editDoctor(doctor: Doctor): Promise<void> {
        const database = this.databaseProvider.rxDatabaseInstance;
        if (database) {
            const docCollection =
                this.databaseProvider?.rxDatabaseInstance.doctor;
            const docToUpdate: RxDocument = await docCollection
                .findOne()
                .where('id')
                .eq(doctor.id)
                .exec();

            if (docToUpdate) {
                await docToUpdate.incrementalPatch({
                    ...doctor,
                });
            }
        }

        return null;
    }

    public async deleteDoctor(doctorId: number) {
        const database = this.databaseProvider.rxDatabaseInstance;
        if (database) {
            const docCollection =
                this.databaseProvider?.rxDatabaseInstance.doctor;
            const doctorToDelete: RxDocument = await docCollection
                .findOne()
                .where('id')
                .eq(doctorId.toString())
                .exec();

            if (doctorToDelete) {
                doctorToDelete.remove();
            }
        }
    }
}
