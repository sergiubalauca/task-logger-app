import type { RxDocument, RxCollection, RxDatabase } from 'rxdb';
import { RxLogWorkDocumentType } from '../schemas';

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

export type RxLogWorkCollections = {
    logWork: RxLogWorkCollection;
    // logWork: RxCollection;
};

export type RxLogWorkDatabase = RxDatabase<RxLogWorkCollections>;
