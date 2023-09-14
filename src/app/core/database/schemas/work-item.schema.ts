import {
    RxJsonSchema,
    toTypedRxJsonSchema,
    ExtractDocumentTypeFromTypedRxJsonSchema,
} from 'rxdb';
export const WORKITEM_SCHEMA_LITERAL = {
    title: 'work item schema',
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
        name: {
            type: 'string',
            default: '',
            maxLength: 100,
        },
        price: {
            type: 'number',
            default: 0,
        },
        description: {
            type: 'string',
            default: '',
            maxLength: 100,
        },
        mongoId: {
            type: 'string',
            default: '',
            maxLength: 100,
        },
    },
};

const schemaTyped = toTypedRxJsonSchema(WORKITEM_SCHEMA_LITERAL);
export type RxWorkItemDocumentType = ExtractDocumentTypeFromTypedRxJsonSchema<
    typeof schemaTyped
>;

export const WORKITEM_SCHEMA: RxJsonSchema<RxWorkItemDocumentType> =
    WORKITEM_SCHEMA_LITERAL;
