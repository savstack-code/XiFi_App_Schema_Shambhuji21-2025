import request from "request-promise";
import logger from "../config/winston.logger";
import { DatabaseProvider } from "../database/database.provider";
import { SMSErrorRepository } from "../database/repositories/data.smsError.repository";

type DomesticSMSResp =
  | {
      status: "failure";
      errors: {
        code: number;
        message: string;
      }[];
      warnings?: {
        code: number;
        message: string;
      }[];
    }
  | {
      status: "success";
      warnings?: {
        code: number;
        message: string;
      }[];
      message: {
        num_parts: number;
        sender: string;
        content: string;
      };
      messages: {
        id: string;
        recipient: number;
      }[];
      [k: string]: any;
    };
export class SmsProvider {
  private smsSwitch: any;
  constructor() {
    this.smsSwitch = process.env.SMSSWITCH;
  }

  public async sendSms(phoneNumber: string, message: string) {
    try {
      if (this.smsSwitch.toUpperCase() == "ON") {
        let baseSmsURL = process.env.SMSURL;
        let smsSender = process.env.SMSSENDER;
        let smsRequestURL = `${baseSmsURL}&sender=${smsSender}&numbers=91${phoneNumber}&message=${message}`;
        const responseTxt = await request(smsRequestURL);
        const response: DomesticSMSResp = JSON.parse(responseTxt);
        if (response.status !== "success") {
          this.storeSMSError(phoneNumber, false, responseTxt);
          logger.error(`Unable to send sms: `);
        }
        return response;
      }
    } catch (error: any) {
      logger.error(error);
      logger.error(
        `SMS not sent for the mobile number ${phoneNumber}, because of network related issue`
      );
      this.storeSMSError(phoneNumber, false, error);
    }
  }

  public async sendInternationalSms(phoneNumber: string, message: string) {
    try {
      if (this.smsSwitch.toUpperCase() == "ON") {
        let baseSmsURL = process.env.SMS_INTERNATIONAL_URL;
        let smsRequestURL = `${baseSmsURL}&number=${phoneNumber}&text=${message}`;
        const response = await request(smsRequestURL);
        logger.info(`International SMS response: ${response}`);
        const responseArray = response.split("|");
        const responseObject = {
          errorCode: responseArray[0],
          mobileNumber: responseArray[1],
          messageId: responseArray[2],
        };
        logger.info(responseObject);
        if (responseObject.errorCode !== "1701") {
          this.storeSMSError(phoneNumber, true, JSON.stringify(response));
        }
        return responseObject;
      }
    } catch (error: any) {
      logger.error(error);
      console.log(error);
      this.storeSMSError(phoneNumber, true, error.message);
    }
  }
  private async storeSMSError(
    receiver: string,
    isInternational: boolean,
    errorText: string
  ) {
    const connection = await DatabaseProvider.getConnection();
    const smsErrorRepo = connection.getCustomRepository(SMSErrorRepository);
    smsErrorRepo
      .createAndSave({ receiver, errorText, isInternational })
      .catch((err) => {
        logger.error(`Unable to store SMS error: ${err.message}`);
      });
  }
}

export const smsProvider = new SmsProvider();
