export interface Doctor {
    id: string;
    name: string;
    phone: string;
}

export interface DoctorDoc {
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
}
