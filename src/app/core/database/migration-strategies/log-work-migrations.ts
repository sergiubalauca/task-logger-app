import { inject } from '@angular/core';
import { DoctorRepository, WorkItemRepository } from '../repositories';
import { RxLogWorkDocumentType } from '../schemas';

export const migration1 = (oldDoc: RxLogWorkDocumentType) => {
    const newDoc = oldDoc.doctorGroup.map((doctor) => {
        doctor.doctor.pacient = doctor.doctor.pacient.map((pacient) => {
            pacient.workItemProps = pacient.workItemProps.map(
                (workItemAndProps) => {
                    workItemAndProps.comment = '';
                    return workItemAndProps;
                }
            );
            return pacient;
        });
        return doctor;
    });

    const res = {
        ...oldDoc,
        doctorGroup: newDoc,
    };

    return res;
};

export const migration2 = async (oldDoc: RxLogWorkDocumentType) => {
    for (const doctor of oldDoc.doctorGroup) {
        doctor.doctor.mongoId = '';

        for (const pacient of doctor.doctor.pacient) {
            for (const workItemAndProps of pacient.workItemProps) {
                workItemAndProps.workItem.mongoId = '';
            }
        }
    }

    const res = {
        ...oldDoc,
    };

    return res;
};
