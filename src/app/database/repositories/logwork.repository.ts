import { Injectable } from '@angular/core';
import { DailyWork } from 'src/app/shared/models/dailyWork';
import { RxDatabaseProvider } from '../rx-database.provider';

@Injectable()
export class LogWorkRepository {
    constructor(private readonly databaseProvider: RxDatabaseProvider) {}

    public async editDailyWork(dailyWork: DailyWork): Promise<void> {
        const database = this.databaseProvider.rxDatabaseInstance;

        if (database) {
            const docCollection =
                this.databaseProvider?.rxDatabaseInstance.logWork;

            const workItemToUpdate: any = await docCollection
                .findOne()
                .where('id')
                .eq(dailyWork.id)
                .exec();

            if (workItemToUpdate) {
                await workItemToUpdate.incrementalPatch({
                    ...dailyWork,
                });
            }
        }
    }
}
