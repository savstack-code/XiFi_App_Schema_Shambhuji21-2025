import logger from "../../config/winston.logger";
export class ServiceResponse {
  public success: boolean = false;
  public result: any = {};
  public statusCode: string = "400";
  public errorCode: string | null = null;
  public errors: Array<string> = [];
  public setError(
    errorMessage: string,
    statusCode?: string,
    errorCode?: string
  ) {
    this.success = false;
    this.errors.push(errorMessage);
    if (statusCode) {
      this.statusCode = statusCode;
    }
    if (errorCode) {
      this.errorCode = errorCode;
    }
    logger.error(errorMessage);
    return this;
  }
  public setSuccess(result?: any) {
    this.success = true;
    this.statusCode = "200";
    if (result) {
      this.result = result;
    }
    return this;
  }
}
