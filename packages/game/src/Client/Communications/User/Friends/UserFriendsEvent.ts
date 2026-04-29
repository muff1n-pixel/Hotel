import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { UserFriendsData } from "@pixel63/events";
import { clientInstance } from "@Game/index";

export default class UserFriendsEvent implements ProtobuffListener<UserFriendsData> {
    async handle(payload: UserFriendsData) {
        clientInstance.friends.value = payload.friends;
        clientInstance.incomingFriendRequests.value = payload.incomingRequests;
        clientInstance.outgoingFriendRequests.value = payload.outgoingRequests;
    }
}
