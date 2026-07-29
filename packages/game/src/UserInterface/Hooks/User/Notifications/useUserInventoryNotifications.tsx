import { useUserBotNotifications } from "./useUserBotNotifications";
import { useUserFurnitureNotifications } from "./useUserFurnitureNotifications";
import { useUserPetNotifications } from "./useUserPetNotifications";

export function useUserInventoryNotifications() {
    const userFurnitureNotifications = useUserFurnitureNotifications();
    const userPetNotifications = useUserPetNotifications();
    const userBotNotifications = useUserBotNotifications();

    return userFurnitureNotifications.notifications.length + userPetNotifications.notifications.length + userBotNotifications.notifications.length;
}
