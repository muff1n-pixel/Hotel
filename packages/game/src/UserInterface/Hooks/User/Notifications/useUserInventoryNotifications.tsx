import { useUserBotNotifications } from "./useUserBotNotifications";
import { useUserFurnitureNotifications } from "./useUserFurnitureNotifications";
import { useUserPetNotifications } from "./useUserPetNotifications";
import { useUserBadgeNotifications } from "./useUserBadgeNotifications";

export function useUserInventoryNotifications() {
    const userFurnitureNotifications = useUserFurnitureNotifications();
    const userPetNotifications = useUserPetNotifications();
    const userBotNotifications = useUserBotNotifications();
    const userBadgeNotifications = useUserBadgeNotifications();

    return userFurnitureNotifications.notifications.length + userPetNotifications.notifications.length + userBotNotifications.notifications.length + userBadgeNotifications.notifications.length;
}
