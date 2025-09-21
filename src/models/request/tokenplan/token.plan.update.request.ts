export default interface TokenPlanUpdateRequest {
    identifier: number;
    name: string;
    amount: number;
    xiKasuTokens: number;
    status: string;
    currency:string;
    description :string;
}