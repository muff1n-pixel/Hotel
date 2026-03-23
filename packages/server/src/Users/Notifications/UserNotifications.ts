import { WidgetNotificationData } from "@pixel63/events";
import User from "../User";

export default class UserNotifications {
    constructor(private readonly user: User) {

    }

    public sendNotification(data: WidgetNotificationData) {
        this.user.sendProtobuff(WidgetNotificationData, data);
    }
}
