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
