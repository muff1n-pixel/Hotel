import { useCallback, useEffect, useState } from "react";
import { clientInstance } from "../../../..";

export function useUserFurnitureNotifications() {
    const [notifications, setNotifications] = useState(clientInstance.notifications.userFurnitureNotifications.value);
    const [_state, setState] = useState(clientInstance.notifications.userFurnitureNotifications.state);

    useEffect(() => {
        return clientInstance.notifications.userFurnitureNotifications.subscribe((value) => {
            setNotifications(value);
            setState(clientInstance.notifications.userFurnitureNotifications.state);
        });
    }, []);

    const removeUserFurnitureNotification = useCallback((userFurnitureId: string) => {
        clientInstance.notifications.userFurnitureNotifications.value = notifications.filter((notificationId) => notificationId !== userFurnitureId);
    }, [notifications]);

    const hasUserFurnitureNotification = useCallback((userFurnitureId: string) => {
        return notifications.some((notificationId) => notificationId === userFurnitureId);
    }, [notifications]);

    return {
        notifications,
        hasUserFurnitureNotification,
        removeUserFurnitureNotification
    };
}
