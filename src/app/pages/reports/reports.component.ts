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
    imports: [HeaderComponent, IonicModule, CommonModule]
})
export class ReportsComponent {
    private readonly reportsService = inject(ReportsService);
    protected readonly dummyReports: ReportDto[] = [
        {
            monthlyReports: {
                month: 'January',
                numberOfElements: 1,
                totalPrice: 100,
                workedHours: 10,
                workItem: [
                    {
                        name: 'Work Item 1',
                        numberOfElements: 1,
                        totalPriceOfElements: 100,
                        id: '1',
                    },
                    {
                        name: 'Work Item 2',
                        numberOfElements: 2,
                        totalPriceOfElements: 100,
                        id: '2',
                    },
                ],
            },
        },
        {
            monthlyReports: {
                month: 'February',
                numberOfElements: 2,
                totalPrice: 200,
                workedHours: 20,
                workItem: [
                    {
                        name: 'Work Item 3',
                        numberOfElements: 2,
                        totalPriceOfElements: 200,
                        id: '3',
                    },
                    {
                        name: 'Work Item 4',
                        numberOfElements: 4,
                        totalPriceOfElements: 200,
                        id: '4',
                    },
                ],
            },
        },
    ];
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
                return this.reportsService
                    .sortReportsByMonth(reports)
                    .map((report) => {
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
                                        report.monthlyReports.totalPrice.toFixed(
                                            2
                                        )
                                    ) || 0,
                                workedHours:
                                    Number(
                                        report.monthlyReports.workedHours.toFixed(
                                            2
                                        )
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
