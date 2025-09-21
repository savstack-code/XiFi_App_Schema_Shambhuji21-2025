import { ServiceResponse } from "../../models/response/ServiceResponse";
import logger from "../../config/winston.logger";
import PushNotificationPayload from "../models/push.notification.payload";
import request from "request-promise";

export class NotificationService {
  public async sendNotification(
    deviceType: string,
    payload: PushNotificationPayload
  ): Promise<ServiceResponse> {
    let serviceResponse = new ServiceResponse();

    if (deviceType == "Android") {
      let androidNotificationURL = process.env.ANDROID_NOTIFICATION_URL || "";
      let androidNotificationApikey =
        process.env.ANDROID_NOTIFICATION_API_KEY || "";
      if (androidNotificationURL == "" || androidNotificationApikey == "") {
        serviceResponse.errors.push(
          "Android notification settings are not found."
        );
        return serviceResponse;
      }
      var notificationOptions = {
        method: "POST",
        uri: androidNotificationURL,
        body: payload,
        headers: {
          "content-type": "application/json",
          Authorization: "key=" + androidNotificationApikey,
        },
        json: true, // Automatically stringifies the body to JSON
      };

      const response = await request(notificationOptions);
      if (response.success) {
        serviceResponse.success = true;
        serviceResponse.statusCode = "200";
        serviceResponse.result = {
          messageId: response.results[0].message_id,
          message: "Notification successfully sent.",
        };
        logger.info(
          `Notification Message Id:: ${response.results[0].message_id}, Device Token:: ${payload.to}, ${payload.notification.body}`
        );
      } else {
        serviceResponse.success = false;
        serviceResponse.statusCode = "400";
        serviceResponse.errors.push(response.results[0].error);
        logger.info(
          `Notification not sent , Device Token:: ${payload.to}, ${response.results[0].error}`
        );
      }
    } else if (deviceType == "IOS") {
      const apn = require("apn");

      let options = {
        token: {
          key: "cert_notifications.p8",
          keyId: "952D5S5MX7",
          teamId: "77VK9KN7HW",
        },
        production: true,
      };

      let apnProvider = new apn.Provider(options);

      // Replace deviceToken with your particular token:
      let deviceToken = payload.to;

      // Prepare the notifications
      let notification = new apn.Notification();
      notification.alert = payload.notification;
      notification.payload = { messageFrom: payload.notification.title };

      // Replace this with your app bundle ID:
      notification.topic = "com.xifinetworks.xifi";

      // Send the actual notification
      apnProvider
        .send(notification, deviceToken)
        .then(
          (result: {
            sent: any;
            device: any;
            failed: { status: string; response: string };
          }) => {
            // Show the result of the send operation:
            if (result.sent) {
              serviceResponse.success = true;
              serviceResponse.statusCode = "200";
              serviceResponse.result = {
                messageId: result.device,
                message: "Notification successfully sent.",
              };
              logger.info(
                `Notification Message Id:: ${result.device}, Device Token:: ${payload.to}, ${payload.notification.body}`
              );
            } else {
              serviceResponse.success = false;
              serviceResponse.statusCode = result.failed.status;
              serviceResponse.errors.push(result.failed.response);
              logger.info(
                `Notification not sent , Device Token:: ${payload.to}, ${result.failed.response}`
              );
            }
          }
        );
    }
    return serviceResponse;
  }
}
export const notificationService = new NotificationService();
