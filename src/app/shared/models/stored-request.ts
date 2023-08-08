export interface StoredRequest {
    url: string;
    type: string;
    data: any;
    time: number;
    id: string;
    completed: boolean;
    response: any;
    header: any;
}
