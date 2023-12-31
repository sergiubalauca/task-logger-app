export interface ReportDto {
    monthlyReports: {
        month: string;
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
