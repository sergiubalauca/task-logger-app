import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RxDatabaseProvider } from './rx-database.provider';

const appInitializer = (dbProvider: RxDatabaseProvider) => async () => {
    await dbProvider.createDatabase();
};

@NgModule({
    declarations: [],
    imports: [CommonModule],
    providers: [
        RxDatabaseProvider,
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializer,
            multi: true,
            deps: [RxDatabaseProvider],
        },
    ],
})
export class RxDatabaseModule {}
