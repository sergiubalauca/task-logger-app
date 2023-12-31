import { Component, OnInit, inject } from '@angular/core';
import { NavController, IonicModule } from '@ionic/angular';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ReportsService } from '@abstraction';
import { Observable, map } from 'rxjs';
import { ReportDto } from '@shared';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
    standalone: true,
    imports: [HeaderComponent, IonicModule, CommonModule],
})
export class ReportsComponent implements OnInit {
    private readonly reportsService = inject(ReportsService);
    // eslint-disable-next-line @typescript-eslint/member-ordering
    protected readonly reports$: Observable<ReportDto[]> = this.reportsService
        .getReports({
            query: `
                query {
                    reports (filters:{  }){
                        monthlyReports{
                            month,
                            numberOfElements,
                            totalPrice,
                            workedHours,
                            workItem{
                                name,
                                numberOfElements,
                                totalPriceOfElements
                            }
                        }
                    }
                }
                `,
            filters: {},
        })
        .pipe(
            map((reports) => {
                console.log(reports);
                return reports;
            })
        );

    constructor(private navController: NavController) {}

    ngOnInit() {}

    // public async goToDoctorsList(): Promise<boolean> {
    //     return this.navController.navigateForward('/home/setup/doctors');
    // }

    // public async goToWorkItemsList(): Promise<boolean> {
    //     return this.navController.navigateForward('/home/setup/work-items');
    // }
}
