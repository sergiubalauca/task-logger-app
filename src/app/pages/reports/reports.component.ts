import { Component, OnInit, inject } from '@angular/core';
import { NavController, IonicModule } from '@ionic/angular';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ReportsService } from '@abstraction';
import { Observable } from 'rxjs';
import { ReportDto } from '@shared';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
    standalone: true,
    imports: [HeaderComponent, IonicModule],
})
export class ReportsComponent implements OnInit {
    private readonly reportsService = inject(ReportsService);
    // eslint-disable-next-line @typescript-eslint/member-ordering
    protected readonly reports$: Observable<ReportDto> =
        this.reportsService.getReports({
            query: `
                    reports (filters:{ date: "22-12-2023" }){
                        monthlyReports{
                            month,
                            numberOfElements,
                            totalPrice,
                            workItem{
                                name,
                                numberOfElements
                            }
                        }
                    }
                `,
            filters: {},
        });

    constructor(private navController: NavController) {}

    ngOnInit() {}

    // public async goToDoctorsList(): Promise<boolean> {
    //     return this.navController.navigateForward('/home/setup/doctors');
    // }

    // public async goToWorkItemsList(): Promise<boolean> {
    //     return this.navController.navigateForward('/home/setup/work-items');
    // }
}
