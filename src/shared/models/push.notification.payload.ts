import PushNotificationMessageModel from "./push.notification.message.model";

export default interface PushNotificationPayload {
    notification: PushNotificationMessageModel;
    to: string;
}