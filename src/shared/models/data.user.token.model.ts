export default interface DataUserTokenModel {
    userId: string;
    tokens: number;
    balance?: any;
    transactionType: string;
    referenceNo: string;
    status: string;
    source: string;
}