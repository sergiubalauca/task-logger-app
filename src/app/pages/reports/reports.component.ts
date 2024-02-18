import { Component, inject } from '@angular/core';
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
export class ReportsComponent {
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
                return reports.map((report) => {
                    return {
                        ...report,
                        monthlyReports: {
                            ...report.monthlyReports,
                            numberOfElements:
                                Number(
                                    report.monthlyReports.numberOfElements.toFixed(
                                        2
                                    )
                                ) || 0,
                            totalPrice:
                                Number(
                                    report.monthlyReports.totalPrice.toFixed(2)
                                ) || 0,
                            workedHours:
                                Number(
                                    report.monthlyReports.workedHours.toFixed(2)
                                ) || 0,
                            workItem: report.monthlyReports.workItem.map(
                                (workItem) => {
                                    return {
                                        ...workItem,
                                        numberOfElements:
                                            Number(
                                                workItem.numberOfElements.toFixed(
                                                    2
                                                )
                                            ) || 0,
                                        totalPriceOfElements:
                                            Number(
                                                workItem.totalPriceOfElements.toFixed(
                                                    2
                                                )
                                            ) || 0,
                                    };
                                }
                            ),
                        },
                    };
                });
            })
        );

    constructor(private navController: NavController) {}
}
