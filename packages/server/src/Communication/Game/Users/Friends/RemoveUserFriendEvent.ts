import { GetUserFriendsData, RemoveUserFriendData, UserFriendsData, UserFriendUpdateData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener";
import User from "../../../../Users/User";
import { game } from "../../../..";
import { UserFriendModel } from "../../../../Database/Models/Users/Friends/UserFriendModel";
import UserFriends from "../../../../Users/Friends/UserFriends";

export default class RemoveUserFriendEvent implements ProtobuffListener<RemoveUserFriendData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: User, payload: RemoveUserFriendData): Promise<void> {
        const friend = user.friends.friends.find((friend) => friend.friend.id === payload.userId);

        if(!friend) {
            throw new Error("User is not friends with user.");
        }

        await friend.destroy();

        user.friends.friends.splice(user.friends.friends.indexOf(friend), 1);

        user.sendProtobuff(UserFriendUpdateData, UserFriendUpdateData.create({
            type: "friend_removed",
            friend: UserFriends.getFriendData(friend.friend)
        }));

        const friendUser = game.getUserById(friend.friend.id);

        if(friendUser) {
            const friend = friendUser.friends.friends.find((friend) => friend.friend.id === user.model.id);

            if(friend) {
                await friend.destroy();
                
                friendUser.friends.friends.splice(friendUser.friends.friends.indexOf(friend), 1);

                friendUser.sendProtobuff(UserFriendUpdateData, UserFriendUpdateData.create({
                    type: "friend_removed",
                    friend: UserFriends.getFriendData(friend.friend)
                }));
            }
        }
        else {
            await UserFriendModel.destroy({
                where: {
                    userId: friend.friend.id,
                    friendId: user.model.id,
                },
                limit: 1
            });
        }
    }
}
