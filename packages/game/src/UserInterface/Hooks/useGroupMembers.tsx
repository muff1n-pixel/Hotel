import { GetGroupMembersData, GroupMemberData, GroupMembersData } from "@pixel63/events";
import { useEffect, useState } from "react";
import { webSocketClient } from "@Game/index";

export default function useGroupMembers(groupId?: string) {
    const [groupMembers, setGroupMembers] = useState<GroupMemberData[]>();

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(GroupMembersData, {
            async handle(payload: GroupMembersData) {
                if(payload.groupId === groupId) {
                    setGroupMembers(payload.members);
                }
            },
        });

        webSocketClient.sendProtobuff(GetGroupMembersData, GetGroupMembersData.create({
            id: groupId
        }));

        return () => {
            webSocketClient.removeProtobuffListener(GroupMembersData, listener);
        };
    }, [groupId]);

    return groupMembers;
}
