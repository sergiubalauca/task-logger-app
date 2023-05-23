import {
    RxJsonSchema,
    toTypedRxJsonSchema,
    ExtractDocumentTypeFromTypedRxJsonSchema,
} from 'rxdb';
export const WORKITEM_SCHEMA_LITERAL = {
    title: 'doctor schema',
    description: 'describes a work item',
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
        workitem: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    default: '',
                    maxLength: 100,
                },
                name: {
                    type: 'string',
                    default: '',
                    maxLength: 100,
                },
            },
        },
    },
};

const schemaTyped = toTypedRxJsonSchema(WORKITEM_SCHEMA_LITERAL);
export type RxDoctorDocumentType = ExtractDocumentTypeFromTypedRxJsonSchema<
    typeof schemaTyped
>;

export const DOCTOR_SCHEMA: RxJsonSchema<RxDoctorDocumentType> =
    WORKITEM_SCHEMA_LITERAL;
