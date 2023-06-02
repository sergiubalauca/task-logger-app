export interface DailyWork {
    id: string;
    doctorGroup: {
        doctorArray: {
            doctor: {
                description: string;
                displayBoth: boolean;
                id: string;
                isSelected: boolean;
                value: string;
            };
            patientGroup: {
                patientArray: {
                    patient: string;
                    workItemGroup: {
                        workItemAndNumber: {
                            numberOfWorkedItems: number;
                            workItem: {
                                description: string;
                                displayBoth: boolean;
                                id: string;
                                isSelected: boolean;
                                value: string;
                            };
                        }[];
                    };
                }[];
            };
        }[];
    };
    timeGroup: {
        startTime: string;
        endTime: string;
    };
}
