import { useUserFurnitureNotifications } from "./useUserFurnitureNotifications";

export function useUserInventoryNotifications() {
    const userFurnitureNotifications = useUserFurnitureNotifications();

    return userFurnitureNotifications.notifications.length;
}
