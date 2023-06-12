import { Injectable, isDevMode } from '@angular/core';
import {
    DATABASE_NAME,
    DOCTOR_COLLECTION_NAME,
    LOGWORK_COLLECTION_NAME,
    WORK_ITEM_COLLECTION_NAME,
} from '@shared';
import { addRxPlugin, createRxDatabase, RxDatabase } from 'rxdb';
import { RxLogWorkCollections, RxLogWorkDatabase } from './rx-custom-types.ts';
import { LOGWORK_SCHEMA_LITERAL, RxLogWorkDocumentType } from './schemas';
import { isRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { DOCTOR_SCHEMA_LITERAL } from './schemas/doctor.schema';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { WORKITEM_SCHEMA_LITERAL } from './schemas/work-item.schema';

@Injectable()
export class RxDatabaseProvider {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    private DB_INSTANCE: RxLogWorkDatabase;
    private readonly collectionSettings = {
        [LOGWORK_COLLECTION_NAME]: {
            schema: LOGWORK_SCHEMA_LITERAL,
            // methods: {
            //     // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
            //     hpPercent(rxDoc: RxLogWorkDocument): any {
            //         console.log('GSB - rxDoc: ', rxDoc);
            //         // return (rxDoc.hp / 100) * 100;
            //     },
            // },
            // sync: true,
        },
        [DOCTOR_COLLECTION_NAME]: {
            schema: DOCTOR_SCHEMA_LITERAL,
        },
        [WORK_ITEM_COLLECTION_NAME]: {
            schema: WORKITEM_SCHEMA_LITERAL,
        },
    };

    constructor() {}
    public get rxDatabaseInstance(): RxLogWorkDatabase {
        if (!isRxDatabase(this.DB_INSTANCE)) {
            throw new Error('Database not initialized');
        }
        return this.DB_INSTANCE;
    }

    private set setRxDatabaseInstance(database: RxLogWorkDatabase) {
        this.DB_INSTANCE = database;
    }

    public async createDatabase(): Promise<RxLogWorkDatabase> {
        if (isRxDatabase(this.DB_INSTANCE)) {
            return this.rxDatabaseInstance;
        }

        try {
            if (isDevMode()) {
                addRxPlugin(RxDBDevModePlugin);
                addRxPlugin(RxDBQueryBuilderPlugin);
            }

            const database = await createRxDatabase<RxLogWorkCollections>({
                name: DATABASE_NAME,
                storage: getRxStorageDexie(),
            });

            await database.addCollections(this.collectionSettings);
            if (database !== null) {
                await this.setDatabaseHooks(database);
            }
            this.setRxDatabaseInstance = database;
        } catch (error) {
            throw new Error(error);
        }
    }

    public async destroyDatabase(): Promise<void> {
        if (isRxDatabase(this.DB_INSTANCE)) {
            await this.DB_INSTANCE.destroy();
        }
    }

    public async setDatabaseHooks(
        rxDatabase: RxDatabase<RxLogWorkCollections>
    ): Promise<void> {
        return null;
        // return await rxDatabase.collections[LOGWORK_COLLECTION_NAME].preInsert(
        //     async (docObj: RxLogWorkDocumentType) => {
        //         // eslint-disable-next-line @typescript-eslint/dot-notation
        //         const patient = docObj['patient'];
        //         const has = await rxDatabase.collections[
        //             LOGWORK_COLLECTION_NAME
        //         ].findOne({
        //             selector: {
        //                 patient,
        //             },
        //         }).exec();
        //         if (has != null) {
        //             // alert('another hero already has the patient ' + patient);
        //             throw new Error('patient already there');
        //         }
        //         return rxDatabase.collections[LOGWORK_COLLECTION_NAME];
        //     },
        //     false
        // );
    }
}
