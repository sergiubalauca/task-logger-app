import {
    RxJsonSchema,
    toTypedRxJsonSchema,
    ExtractDocumentTypeFromTypedRxJsonSchema,
} from 'rxdb';
export const LOGWORK_SCHEMA_LITERAL = {
    title: 'log work schema',
    description: 'describes a simple log work',
    version: 0,
    keyCompression: false,
    primaryKey: {
        key: 'id',
        fields: ['patient', 'workItem'],
        separator: '|',
    },
    type: 'object',
    properties: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        id: {
            type: 'string',
            maxLength: 100,
            // primary: true,
        },
        doctor: {
            type: 'object',
            properties: {
                description: {
                    type: 'string',
                    default: '',
                    maxLength: 100,
                },
                id: {
                    type: 'string',
                    default: '',
                    maxLength: 100,
                },
                value: {
                    type: 'string',
                    default: '',
                    maxLength: 100,
                },
            },
        },
        patient: {
            type: 'string',
        },
        workItem: {
            type: 'string',
        },
        numberOfWorkItems: {
            type: 'string',
            default: '',
        },
        startTime: {
            type: 'string',
            default: '',
        },
        endTime: {
            type: 'string',
            default: '',
        },
        hp: {
            type: 'number',
            minimum: 0,
            maximum: 100,
            default: 100,
        },
    },
    // required: ['name', 'color', 'hp'],
};

const schemaTyped = toTypedRxJsonSchema(LOGWORK_SCHEMA_LITERAL);
export type RxLogWorkDocumentType = ExtractDocumentTypeFromTypedRxJsonSchema<
    typeof schemaTyped
>;

export const LOGWORK_SCHEMA: RxJsonSchema<RxLogWorkDocumentType> =
    LOGWORK_SCHEMA_LITERAL;
