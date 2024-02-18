import { Injectable, inject } from '@angular/core';
import { HttpService } from '@core';
import { ReportDto } from '@shared';
import { Observable, map } from 'rxjs';

@Injectable()
export class ReportsService {
    private readonly httpService = inject(HttpService);

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
}
