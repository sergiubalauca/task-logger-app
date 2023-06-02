export const DATABASE_NAME = 'log-work';
export const LOGWORK_COLLECTION_NAME = 'logwork';
export const DOCTOR_COLLECTION_NAME = 'doctor';
export const WORK_ITEM_COLLECTION_NAME = 'workitem';

// export class CollectionNames {
//     [DOCTOR_COLLECTION_NAME] = DOCTOR_COLLECTION_NAME;
//     [WORK_ITEM_COLLECTION_NAME] = WORK_ITEM_COLLECTION_NAME;
// }

export type CollectionNames = typeof DOCTOR_COLLECTION_NAME | typeof WORK_ITEM_COLLECTION_NAME;
