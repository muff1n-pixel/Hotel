import { GetGroupData, GroupData } from "@pixel63/events";
import { useEffect, useState } from "react";
import { webSocketClient } from "@Game/index";

export default function useGroup(groupId?: string) {
    const [group, setGroup] = useState<GroupData>();

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(GroupData, {
            async handle(payload: GroupData) {
                if(payload.id === groupId) {
                    setGroup(payload);
                }
            },
        });

        webSocketClient.sendProtobuff(GetGroupData, GetGroupData.create({
            id: groupId
        }));

        return () => {
            webSocketClient.removeProtobuffListener(GroupData, listener);
        };
    }, [groupId]);

    return group;
}
