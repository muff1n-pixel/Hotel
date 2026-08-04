import { GetUserFriendsData, SendUserFriendRequestData, UserFriendUpdateData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener";
import User from "../../../../Users/User";
import { UserModel } from "../../../../Database/Models/Users/UserModel";
import { UserFriendRequestModel } from "../../../../Database/Models/Users/Friends/UserFriendRequestModel";
import { randomUUID } from "node:crypto";
import { game } from "../../../..";
import UserFriends from "../../../../Users/Friends/UserFriends";

export default class SendUserFriendRequestEvent implements ProtobuffListener<SendUserFriendRequestData> {
    minimumDurationBetweenEvents?: number = 200;

    async handle(user: User, payload: SendUserFriendRequestData): Promise<void> {
        const targetUser = await UserModel.findByPk(payload.userId);

        if(!targetUser) {
            throw new Error("User does not exist.");
        }

        if(targetUser.id === user.model.id) {
            throw new Error("User can't add themselves as a friend... :(");
        }

        if(user.friends.friends.some((friend) => friend.friend.id === targetUser.id)) {
            throw new Error("User is already friends.");
        }

        if(user.friends.incomingRequests.some((request) => request.sender.id === targetUser.id)) {
            throw new Error("User already has a friend request.");
        }

        if(user.friends.outgoingRequests.some((request) => request.receiver.id === targetUser.id)) {
            throw new Error("User already has an outgoing friend request.");
        }

        const request = await UserFriendRequestModel.create({
            id: randomUUID(),

            senderId: user.model.id,
            receiverId: targetUser.id
        });

        request.sender = user.model;
        request.receiver = targetUser;


        // Send outgoing request to user
        user.friends.outgoingRequests.push(request);

        user.sendProtobuff(UserFriendUpdateData, UserFriendUpdateData.create({
            friend: UserFriends.getFriendData(request.receiver),

            type: "outgoing_request"
        }));

        // Send incoming request to target
        const targetUserClient = game.getUserById(targetUser.id);

        if(targetUserClient) {
            targetUserClient.friends.incomingRequests.push(request);

            targetUserClient.sendProtobuff(UserFriendUpdateData, UserFriendUpdateData.create({
                friend: UserFriends.getFriendData(request.sender),

                type: "incoming_request"
            }));
        }
    }
}
