export interface Doctor {
    id: string;
    name: string;
    phone: string;
    mongoId?: string;
}

export interface DoctorDto {
    name: string;
    phone: string;
    _id: string;
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
