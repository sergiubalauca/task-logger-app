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
    id: string;
}
