import { useCallback, useEffect, useState } from "react";
import { clientInstance } from "../../../..";

export function useUserBadgeNotifications() {
    const [notifications, setNotifications] = useState(clientInstance.notifications.userBadgeNotifications.value);
    const [_state, setState] = useState(clientInstance.notifications.userBadgeNotifications.state);

    useEffect(() => {
        return clientInstance.notifications.userBadgeNotifications.subscribe((value) => {
            setNotifications(value);
            setState(clientInstance.notifications.userBadgeNotifications.state);
        });
    }, []);

    const removeUserBadgeNotification = useCallback((userBadgeId: string) => {
        clientInstance.notifications.userBadgeNotifications.value = notifications.filter((notificationId) => notificationId !== userBadgeId);
    }, [notifications]);

    const hasUserBadgeNotification = useCallback((userBadgeId: string) => {
        return notifications.some((notificationId) => notificationId === userBadgeId);
    }, [notifications]);

    return {
        notifications,
        hasUserBadgeNotification,
        removeUserBadgeNotification
    };
}
