import {
    RxJsonSchema,
    toTypedRxJsonSchema,
    ExtractDocumentTypeFromTypedRxJsonSchema,
} from 'rxdb';
export const DOCTOR_SCHEMA_LITERAL = {
    title: 'doctor schema',
    description: 'describes a doctor',
    version: 0,
    keyCompression: false,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 100,
            primary: true,
        },
        name: {
            type: 'string',
            default: '',
            maxLength: 100,
        },
        phone: {
            type: 'string',
            default: '',
            maxLength: 100,
        },
        mongoId: {
            type: 'string',
            default: '',
            maxLength: 100,
        }
    },
};

const schemaTyped = toTypedRxJsonSchema(DOCTOR_SCHEMA_LITERAL);
export type RxDoctorDocumentType = ExtractDocumentTypeFromTypedRxJsonSchema<
    typeof schemaTyped
>;

export const DOCTOR_SCHEMA: RxJsonSchema<RxDoctorDocumentType> =
    DOCTOR_SCHEMA_LITERAL;
