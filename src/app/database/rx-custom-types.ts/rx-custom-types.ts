import type { RxDocument, RxCollection, RxDatabase } from 'rxdb';
import { RxLogWorkDocumentType } from '../schemas';
import { RxDoctorDocumentType } from '../schemas/doctor.schema';

// ORM methods
type RxLogWorkDocMethods = {
    hpPercent(): number;
};

export type RxLogWorkDocument = RxDocument<
    RxLogWorkDocumentType,
    RxLogWorkDocMethods
>;

export type RxLogWorkCollection = RxCollection<
    RxLogWorkDocumentType,
    RxLogWorkDocMethods,
    null
>;

export type RxDoctorDocument = RxDocument<RxDoctorDocumentType>;
export type RxDoctorCollection = RxCollection<RxDoctorDocumentType>;

export type RxLogWorkCollections = {
    logWork: RxLogWorkCollection;
    doctor: RxDoctorCollection;
};

export type RxLogWorkDatabase = RxDatabase<RxLogWorkCollections>;
