import { GetUserGroupData, UserGroupData } from "@pixel63/events";
import { useEffect, useState } from "react";
import { webSocketClient } from "@Game/index";

export default function useUserGroup(groupId?: string) {
    const [userGroup, setUserGroup] = useState<UserGroupData>();

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(UserGroupData, {
            async handle(payload: UserGroupData) {
                if(payload.groupId === groupId) {
                    setUserGroup(payload);
                }
            },
        });

        webSocketClient.sendProtobuff(GetUserGroupData, GetUserGroupData.create({
            id: groupId
        }));

        return () => {
            webSocketClient.removeProtobuffListener(UserGroupData, listener);
        };
    }, [groupId]);

    return userGroup;
}
