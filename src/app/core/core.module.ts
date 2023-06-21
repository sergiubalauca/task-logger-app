import { NgModule } from '@angular/core';
import { WorkItemFacade } from '../abstraction/database';
import { DoctorFacade } from '../abstraction/database/doctor.facade';
import { RxDatabaseModule } from './database/rx-database.module';

@NgModule({
    declarations: [],
    imports: [RxDatabaseModule],
    providers: [DoctorFacade, WorkItemFacade],
})
export class CoreModule {}
