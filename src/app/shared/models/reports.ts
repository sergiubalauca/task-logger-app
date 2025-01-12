export interface ReportDto {
    monthlyReports: {
        month: string;
        year: string;
        workItem: {
            id: string;
            name: string;
            numberOfElements: number;
            totalPriceOfElements: number;
        }[];
        totalPrice: number;
        numberOfElements: number;
        workedHours: number;
    };
}
