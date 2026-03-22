import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { WidgetNotificationData } from "@pixel63/events";
import { clientInstance } from "src";

export default class WidgetNotificationEvent implements ProtobuffListener<WidgetNotificationData> {
    async handle(payload: WidgetNotificationData) {
        clientInstance.widgetNotifications.value!.push(payload);
        clientInstance.widgetNotifications.update();
    }
}
