import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { UserFriendMessageData } from "@pixel63/events";
import { clientInstance } from "src";

export default class UserFriendMessageEvent implements ProtobuffListener<UserFriendMessageData> {
    async handle(payload: UserFriendMessageData) {
        let tab = clientInstance.messenger.value?.find((tab) => tab.friend.id === payload.friendId);

        if(!tab) {
            const friend = clientInstance.friends.value?.find((friend) => friend.id === payload.friendId);

            if(!friend) {
                throw new Error("Friend is not registered.");
            }

            tab = {
                friend,
                entries: []
            };

            clientInstance.messenger.value?.push(tab);
        }

        const previousEntry = tab.entries[tab.entries.length - 1];

        if(previousEntry && previousEntry.type === "message" && previousEntry.userId === payload.authorId) {
            previousEntry.message.push(payload.message);

            previousEntry.receivedAt = new Date();
        }
        else {
            tab.entries.push({
                id: Math.random(),
                type: "message",

                userId: payload.authorId,
                message: [payload.message],

                receivedAt: new Date()
            });
        }

        if(payload.authorId !== clientInstance.user.value?.id) {
            clientInstance.messengerUnread.value = true;
        }

        clientInstance.messenger.update();
    }
}
