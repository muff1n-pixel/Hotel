import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { UserFurnitureNotificationData } from "@pixel63/events";
import { clientInstance } from "@Game/index";

export default class UserFurnitureNotificationEvent implements ProtobuffListener<UserFurnitureNotificationData> {
    async handle(payload: UserFurnitureNotificationData) {
        clientInstance.notifications.userFurnitureNotifications.value!.push(payload);
        clientInstance.notifications.userFurnitureNotifications.update();
    }
}
