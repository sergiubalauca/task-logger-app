import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RxDatabaseProvider } from './rx-database.provider';
import { DoctorRepository } from './repositories/doctor.repository';

const appInitializer = (dbProvider: RxDatabaseProvider) => async () => {
    await dbProvider.createDatabase();
};

@NgModule({
    declarations: [],
    imports: [CommonModule],
    providers: [
        RxDatabaseProvider,
        DoctorRepository,
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializer,
            multi: true,
            deps: [RxDatabaseProvider],
        },
    ],
})
export class RxDatabaseModule {}
