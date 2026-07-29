import { useCallback, useEffect, useState } from "react";
import { clientInstance } from "../../../..";

export function useUserBotNotifications() {
    const [notifications, setNotifications] = useState(clientInstance.notifications.userBotNotifications.value);
    const [_state, setState] = useState(clientInstance.notifications.userBotNotifications.state);

    useEffect(() => {
        return clientInstance.notifications.userBotNotifications.subscribe((value) => {
            setNotifications(value);
            setState(clientInstance.notifications.userBotNotifications.state);
        });
    }, []);

    const removeUserBotNotification = useCallback((userBotId: string) => {
        clientInstance.notifications.userBotNotifications.value = notifications.filter((notificationId) => notificationId !== userBotId);
    }, [notifications]);

    const hasUserBotNotification = useCallback((userBotId: string) => {
        return notifications.some((notificationId) => notificationId === userBotId);
    }, [notifications]);

    return {
        notifications,
        hasUserBotNotification,
        removeUserBotNotification
    };
}
