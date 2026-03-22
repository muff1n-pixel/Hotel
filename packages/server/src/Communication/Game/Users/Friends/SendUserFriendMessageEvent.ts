import { SendUserFriendMessageData, UserFriendMessageData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener";
import User from "../../../../Users/User";
import { game } from "../../../..";

export default class SendUserFriendMessageEvent implements ProtobuffListener<SendUserFriendMessageData> {
    async handle(user: User, payload: SendUserFriendMessageData): Promise<void> {
        const friend = user.friends.friends.find((friend) => friend.friend.id === payload.userId);

        if(!friend) {
            throw new Error("User is not friends with user.");
        }

        const friendUser = game.getUserById(friend.friend.id);

        if(!friendUser) {
            throw new Error("User is offline.");
        }

        if(!payload.message.length) {
            throw new Error("Message is empty.");
        }

        friendUser.sendProtobuff(UserFriendMessageData, UserFriendMessageData.create({
            friendId: user.model.id,
            authorId: user.model.id,

            message: payload.message
        }));

        user.sendProtobuff(UserFriendMessageData, UserFriendMessageData.create({
            friendId: friendUser.model.id,
            authorId: user.model.id,

            message: payload.message
        }));
    }
}
