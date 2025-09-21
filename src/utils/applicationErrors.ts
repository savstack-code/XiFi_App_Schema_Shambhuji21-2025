import { ErrorCodeEnum } from "../shared/enums/error-code.enum";

export abstract class ApplicationError extends Error {
    readonly errorCode!: string;
    readonly name!: string;

    constructor(message: object | string) {
        if (message instanceof Object) {
            super(message.toString());
        } else {
            super(message);
        }
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class InvalidDataError extends ApplicationError {
    readonly errorCode = ErrorCodeEnum.INVALID_DATA;

    constructor(message: string | object = "Invalid data") {
        super(message);
    }
}

export class ReferralCodeError extends ApplicationError {
    readonly errorCode = ErrorCodeEnum.REFERRAL_CODE_ERROR;

    constructor(message: string | object = "Invalid referral code.") {
        super(message);
    }
}

export class OtpError extends ApplicationError {
    readonly errorCode = ErrorCodeEnum.OTP_ERROR;

    constructor(message: string | object = "Invalid OTP.") {
        super(message);
    }
}

export class NotEnoughXikasuTokensError extends ApplicationError {
    readonly errorCode = ErrorCodeEnum.NOT_ENOUGH_XIKASU_TOKENS;

    constructor(message: string | object = "Not enough XiKasu tokens.") {
        super(message);
    }
}