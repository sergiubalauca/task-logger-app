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
                        workItemAndNumber: {
                            numberOfWorkItems: number;
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
                            workItemAndNumber: {
                                numberOfWorkItems: number;
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
                        workItemAndNumber: {
                            numberOfWorkItems: number;
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
    breaks?: {
        startTime?: string;
        endTime?: string;
    }[];
}
