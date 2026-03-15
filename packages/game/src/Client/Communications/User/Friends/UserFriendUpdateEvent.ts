import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { UserFriendUpdateData } from "@pixel63/events";
import { clientInstance } from "src";

export default class UserFriendUpdateEvent implements ProtobuffListener<UserFriendUpdateData> {
    async handle(payload: UserFriendUpdateData) {
        if(!payload.friend) {
            throw new Error("Validation error.");
        }

        if(!clientInstance.friends.value) {
            throw new Error("Friends are not loaded.");
        }

        switch(payload.type) {
            case "friend": {
                const existingFriendIndex = clientInstance.friends.value.findIndex((friend) => friend.id === payload.friend!.id);

                if(existingFriendIndex !== -1) {
                    const messenger = clientInstance.messenger.value?.find((tab) => tab.friend.id === payload.friend!.id);

                    if(messenger) {
                        if(clientInstance.friends.value[existingFriendIndex].online !== payload.friend.online) {
                            messenger.entries.push({
                                id: Math.random(),
                                type: "status",

                                status: (payload.friend.online)?("Your friend came online"):("Your friend went offline"),
                                receivedAt: new Date(),
                            });
                        }
                    }

                    clientInstance.friends.value[existingFriendIndex] = payload.friend;
                }
                else {
                    clientInstance.friends.value.push(payload.friend);
                }
                
                clientInstance.friends.update();

                clientInstance.incomingFriendRequests.value = clientInstance.incomingFriendRequests.value?.filter((request) => request.id !== payload.friend!.id);
                clientInstance.outgoingFriendRequests.value = clientInstance.outgoingFriendRequests.value?.filter((request) => request.id !== payload.friend!.id);

                return;
            }

            case "friend_removed": {
                const existingFriendIndex = clientInstance.friends.value.findIndex((friend) => friend.id === payload.friend!.id);

                console.log({ existingFriendIndex });

                if(existingFriendIndex !== -1) {
                    clientInstance.friends.value.splice(existingFriendIndex, 1);
                    clientInstance.friends.update();
                }

                const messenger = clientInstance.messenger.value?.find((tab) => tab.friend.id === payload.friend!.id);

                if(messenger) {
                    clientInstance.messenger.value?.splice(clientInstance.messenger.value.indexOf(messenger), 1);
                    clientInstance.messenger.update();
                }

                return;
            }

            case "incoming_request": {
                clientInstance.incomingFriendRequests.value?.push(payload.friend);
                clientInstance.incomingFriendRequests.update();

                return;
            }

            case "incoming_request_declined": {
                clientInstance.incomingFriendRequests.value = clientInstance.incomingFriendRequests.value?.filter((request) => request.id !== payload.friend!.id);

                return;
            }
            
            case "outgoing_request": {
                clientInstance.outgoingFriendRequests.value?.push(payload.friend);
                clientInstance.outgoingFriendRequests.update();

                return;
            }

            case "outgoing_request_declined": {
                clientInstance.outgoingFriendRequests.value = clientInstance.outgoingFriendRequests.value?.filter((request) => request.id !== payload.friend!.id);

                return;
            }
        }
    }
}
