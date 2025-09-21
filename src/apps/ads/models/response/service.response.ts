export interface ServiceResponse {
    success: boolean;
    result: any;
    statusCode: string;
    errors: Array<string>;
}