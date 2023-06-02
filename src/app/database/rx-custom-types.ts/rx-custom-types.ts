import type { RxDocument, RxCollection, RxDatabase } from 'rxdb';
import { RxLogWorkDocumentType } from '../schemas';
import { RxDoctorDocumentType } from '../schemas/doctor.schema';
import { RxWorkItemDocumentType } from '../schemas/work-item.schema';

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
    RxLogWorkDocMethods
>;

export type RxDoctorDocument = RxDocument<RxDoctorDocumentType>;
export type RxDoctorCollection = RxCollection<RxDoctorDocumentType>;

export type RxWorkItemDocument = RxDocument<RxWorkItemDocumentType>;
export type RxWorkItemCollection = RxCollection<RxWorkItemDocumentType>;

export type RxLogWorkCollections = {
    logWork: RxLogWorkCollection;
    doctor: RxDoctorCollection;
    workitem: RxWorkItemCollection;
};

export type RxLogWorkDatabase = RxDatabase<RxLogWorkCollections>;
