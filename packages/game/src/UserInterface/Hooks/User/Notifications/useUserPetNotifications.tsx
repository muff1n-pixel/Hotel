import { useCallback, useEffect, useState } from "react";
import { clientInstance } from "../../../..";

export function useUserPetNotifications() {
    const [notifications, setNotifications] = useState(clientInstance.notifications.userPetNotifications.value);
    const [_state, setState] = useState(clientInstance.notifications.userPetNotifications.state);

    useEffect(() => {
        return clientInstance.notifications.userPetNotifications.subscribe((value) => {
            setNotifications(value);
            setState(clientInstance.notifications.userPetNotifications.state);
        });
    }, []);

    const removeUserPetNotification = useCallback((userPetId: string) => {
        clientInstance.notifications.userPetNotifications.value = notifications.filter((notificationId) => notificationId !== userPetId);
    }, [notifications]);

    const hasUserPetNotification = useCallback((userPetId: string) => {
        return notifications.some((notificationId) => notificationId === userPetId);
    }, [notifications]);

    return {
        notifications,
        hasUserPetNotification,
        removeUserPetNotification
    };
}
