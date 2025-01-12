import { Injectable, inject } from '@angular/core';
import { HttpService } from '@core';
import { ReportDto } from '@shared';
import { Observable, map } from 'rxjs';

@Injectable()
export class ReportsService {
    private readonly httpService = inject(HttpService);
    protected monthIndices = {
        January: 0,
        February: 1,
        March: 2,
        April: 3,
        May: 4,
        June: 5,
        July: 6,
        August: 7,
        September: 8,
        October: 9,
        November: 10,
        December: 11,
    };

    public getReports(options: {
        query: string;
        filters?: { [key: string]: any };
    }): Observable<ReportDto[]> {
        return this.httpService
            .makeGraphqlPost<
                ReportDto[],
                {
                    query: string;
                    filters?: { [key: string]: any };
                }
            >({
                query: options.query,
                filters: options.filters,
            })
            .pipe(
                map((res) => {
                    if (res.errors && res.errors.length > 0) {
                        throw new Error(res.errors[0].message);
                    }
                    return res.data?.reports || [];
                })
            );
    }

    public sortReportsByYearAndMonth(
        reports: ReportDto[],
        order: 'desc' | 'asc' = 'desc'
    ): ReportDto[] {
        return reports.sort((a, b) => {
            const aYear = parseInt(a['monthlyReports']['year']);
            const bYear = parseInt(b['monthlyReports']['year']);

            if (aYear === bYear) {
                const aMonth = this.monthIndices[a['monthlyReports']['month']];
                const bMonth = this.monthIndices[b['monthlyReports']['month']];

                return order === 'desc' ? bMonth - aMonth : aMonth - bMonth;
            }

            return order === 'desc' ? bYear - aYear : aYear - bYear;
        });
    }
}
