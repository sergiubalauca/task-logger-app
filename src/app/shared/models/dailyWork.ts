export interface DailyWork {
    id: string;
    doctorGroup: {
        doctorArray: {
            doctor: string;
            // doctor: {
            //     description: string;
            //     displayBoth: boolean;
            //     id: string;
            //     isSelected: boolean;
            //     value: string;
            // };
            patientGroup: {
                patientArray: {
                    patient: string;
                    workItemGroup: {
                        workItemAndNumber: {
                            numberOfWorkItems: number;
                            // workItem: {
                            //     description: string;
                            //     displayBoth: boolean;
                            //     id: string;
                            //     isSelected: boolean;
                            //     value: string;
                            // };
                            workItem: string;
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

export interface DailyWorkDoc {
    id?: string;
    doctorGroup?: {
        doctor?: {
            name?: string;
            pacient?: {
                name?: string;
                workItemAndNumber?: {
                    workItem?: {
                        name?: string;
                    };
                    numberOfWorkItems?: string;
                }[];
            }[];
        };
    }[];
    startTime?: string;
    endTime?: string;
}
