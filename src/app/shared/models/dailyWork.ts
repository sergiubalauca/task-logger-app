export interface DailyWork {
    id: string;
    isPartiallySaved: boolean;
    doctorGroup: {
        doctorArray: {
            doctor: string;
            patientGroup: {
                patientArray: {
                    patient: string;
                    workItemGroup: {
                        workItemProps: {
                            numberOfWorkItems: number;
                            workItem: string;
                            color: string;
                        }[];
                    };
                }[];
            };
        }[];
    };
    timeGroup: {
        startTime: string;
        endTime: string;
        breaks: {
            startTime: string;
            endTime: string;
        }[];
    };
    mongoId?: string;
}

export interface DailyWorkDto {
    dailyWork: {
        isPartiallySaved: boolean;
        id: string;
        doctorGroup: {
            doctorArray: {
                doctor: string;
                patientGroup: {
                    patientArray: {
                        patient: string;
                        workItemGroup: {
                            workItemProps: {
                                numberOfWorkItems: number;
                                workItem: string;
                                color: string;
                            }[];
                        };
                    }[];
                };
            }[];
        };
        timeGroup: {
            startTime: string;
            endTime: string;
            breaks: {
                startTime: string;
                endTime: string;
            }[];
        };
    };

    id: string;
    doctorGroup: {
        doctorArray: {
            doctor: string;
            patientGroup: {
                patientArray: {
                    patient: string;
                    workItemGroup: {
                        workItemProps: {
                            numberOfWorkItems: number;
                            workItem: string;
                            color: string;
                        }[];
                    };
                }[];
            };
        }[];
    };
    timeGroup: {
        startTime: string;
        endTime: string;
        breaks: {
            startTime: string;
            endTime: string;
        }[];
    };
    _id: string;
    rxdbId: string;
}

export interface DailyWorkDoc {
    isPartiallySaved: boolean;
    id?: string;
    mongoId?: string;
    doctorGroup?: {
        doctor?: {
            name?: string;
            pacient?: {
                name?: string;
                workItemProps?: {
                    workItem?: {
                        name?: string;
                    };
                    numberOfWorkItems?: string;
                    color?: string;
                }[];
            }[];
        };
    }[];
    startTime?: string;
    endTime?: string;
    breaks?: {
        startTime?: string;
        endTime?: string;
    }[];
}
