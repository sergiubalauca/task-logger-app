import type { RxDocument, RxCollection, RxDatabase } from 'rxdb';
import { RxLogWorkDocumentType } from '../schemas';
import { RxDoctorDocumentType } from '../schemas/doctor.schema';
import { RxWorkItemDocumentType } from '../schemas/work-item.schema';

// ORM methods
type RxLogWorkDocMethods = {
    hpPercent(): number;
};



export type RxLogWorkCollection = RxCollection<RxLogWorkDocumentType,RxLogWorkDocMethods>;
export type RxDoctorCollection = RxCollection<RxDoctorDocumentType>;
export type RxWorkItemCollection = RxCollection<RxWorkItemDocumentType>;

// export type RxDoctorDocument = RxDocument<RxDoctorDocumentType>;
// export type RxWorkItemDocument = RxDocument<RxWorkItemDocumentType>;
// export type RxLogWorkDocument = RxDocument<RxLogWorkDocumentType,RxLogWorkDocMethods>;

export type RxLogWorkCollections = {
    logwork: RxLogWorkCollection;
    doctor: RxDoctorCollection;
    workitem: RxWorkItemCollection;
};

export type RxLogWorkDatabase = RxDatabase<RxLogWorkCollections>;
