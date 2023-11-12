export interface WorkItem {
    id: string;
    name: string;
    price: number;
    description: string;
}

export interface WorkItemDto {
    name: string;
    price: number;
    description: string;
    _id: string;
    id: string;
}
