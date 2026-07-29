import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { UserNotificationData } from "@pixel63/events";
import { clientInstance } from "@Game/index";

export default class UserNotificationEvent implements ProtobuffListener<UserNotificationData> {
    async handle(payload: UserNotificationData) {
        if(payload.userFurnitureId) {
            clientInstance.notifications.userFurnitureNotifications.value!.push(payload.userFurnitureId);
            clientInstance.notifications.userFurnitureNotifications.update();
        }
        
        if(payload.userPetId) {
            clientInstance.notifications.userPetNotifications.value!.push(payload.userPetId);
            clientInstance.notifications.userPetNotifications.update();
        }
        
        if(payload.userBotId) {
            clientInstance.notifications.userBotNotifications.value!.push(payload.userBotId);
            clientInstance.notifications.userBotNotifications.update();
        }
        
        if(payload.userBadgeId) {
            clientInstance.notifications.userBadgeNotifications.value!.push(payload.userBadgeId);
            clientInstance.notifications.userBadgeNotifications.update();
        }
    }
}
