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
    // primaryKey: {
    //     key: 'id',
    //     fields: ['patient', 'workItem'],
    //     separator: '|',
    // },
    primaryKey: 'id',
    type: 'object',
    properties: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        id: {
            type: 'string',
            maxLength: 100,
            // primary: true,
        },
        doctorGroup: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    doctor: {
                        type: 'object',
                        properties: {
                            doctor: {
                                type: 'string',
                                default: '',
                                maxLength: 100,
                            },
                            pacient: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        name: {
                                            type: 'string',
                                            default: '',
                                            maxLength: 100,
                                        },
                                        workItemAndNumber: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    workItem: {
                                                        type: 'object',
                                                        properties: {
                                                            name: {
                                                                type: 'string',
                                                                default: '',
                                                                maxLength: 100,
                                                            },
                                                        },
                                                    },
                                                    numberOfWorkItems: {
                                                        type: 'string',
                                                        default: '',
                                                        maxLength: 100,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        startTime: {
            type: 'string',
            default: '',
        },
        endTime: {
            type: 'string',
            default: '',
        },
        breaks: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    startTime: {
                        type: 'string',
                        default: '',
                    },
                    endTime: {
                        type: 'string',
                        default: '',
                    },
                },
            },
        },
        mongoId: {
            type: 'string',
            default: '',
        },
        // hp: {
        //     type: 'number',
        //     minimum: 0,
        //     maximum: 100,
        //     default: 100,
        // },
    },
    // required: ['name', 'color', 'hp'],
} as const;

const schemaTyped = toTypedRxJsonSchema(LOGWORK_SCHEMA_LITERAL);
export type RxLogWorkDocumentType = ExtractDocumentTypeFromTypedRxJsonSchema<
    typeof schemaTyped
>;

export const LOGWORK_SCHEMA: RxJsonSchema<RxLogWorkDocumentType> =
    LOGWORK_SCHEMA_LITERAL;
