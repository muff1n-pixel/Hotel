import { UpdateUserFriendRequestData, UserFriendUpdateData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener";
import User from "../../../../Users/User";
import { UserModel } from "../../../../Database/Models/Users/UserModel";
import { UserFriendModel } from "../../../../Database/Models/Users/Friends/UserFriendModel";
import { randomUUID } from "node:crypto";
import { game } from "../../../..";
import UserFriends from "../../../../Users/Friends/UserFriends";

export default class UpdateUserFriendRequestEvent implements ProtobuffListener<UpdateUserFriendRequestData> {
    async handle(user: User, payload: UpdateUserFriendRequestData): Promise<void> {
        const targetUser = await UserModel.findByPk(payload.userId);

        if(!targetUser) {
            throw new Error("User does not exist.");
        }

        const incomingRequest = user.friends.incomingRequests.find((request) => request.sender.id === targetUser.id);

        if(incomingRequest) {
            if(payload.accept) {
                // Create user friend
                const userFriend = await UserFriendModel.create({
                    id: randomUUID(),

                    userId: user.model.id,
                    friendId: targetUser.id
                });

                userFriend.user = user.model;
                userFriend.friend = targetUser;

                user.friends.friends.push(userFriend);

                // Create target friend
                const targetFriend = await UserFriendModel.create({
                    id: randomUUID(),

                    userId: targetUser.id,
                    friendId: user.model.id
                });

                targetFriend.user = targetUser;
                targetFriend.friend = user.model;
                
                const targetUserClient = game.getUserById(targetUser.id);

                if(targetUserClient) {
                    targetUserClient.friends.friends.push(targetFriend);
                }
            }

            await incomingRequest.destroy();

            // Remove user incoming request
            user.friends.incomingRequests = user.friends.incomingRequests.filter((request) => request.sender.id !== targetUser.id);

            if(payload.accept) {
                user.sendProtobuff(UserFriendUpdateData, UserFriendUpdateData.create({
                    friend: UserFriends.getFriendData(targetUser),
        
                    type: "friend"
                }));
            }
            else {
                user.sendProtobuff(UserFriendUpdateData, UserFriendUpdateData.create({
                    friend: UserFriends.getFriendData(targetUser),
        
                    type: "incoming_request_declined"
                }));
            }

            // Remove target user outgoing request
            const targetUserClient = game.getUserById(targetUser.id);

            if(targetUserClient) {
                targetUserClient.friends.outgoingRequests = user.friends.outgoingRequests.filter((request) => request.receiver.id !== targetUser.id);
                
                if(payload.accept) {
                    targetUserClient.sendProtobuff(UserFriendUpdateData, UserFriendUpdateData.create({
                        friend: UserFriends.getFriendData(user.model),
            
                        type: "friend"
                    }));
                }
                else {
                    targetUserClient.sendProtobuff(UserFriendUpdateData, UserFriendUpdateData.create({
                        friend: UserFriends.getFriendData(user.model),
            
                        type: "outgoing_request_declined"
                    }));
                }
            }
        }

        const outgoingRequest = user.friends.outgoingRequests.find((request) => request.receiver.id === targetUser.id);

        if(outgoingRequest) {
            await outgoingRequest.destroy();

            user.friends.outgoingRequests.splice(user.friends.outgoingRequests.indexOf(outgoingRequest), 1);

            user.sendProtobuff(UserFriendUpdateData, UserFriendUpdateData.create({
                friend: UserFriends.getFriendData(targetUser),
    
                type: "outgoing_request_declined"
            }));

            const friendUser = game.getUserById(outgoingRequest.receiver.id);

            if(friendUser) {
                const incomingRequest = friendUser.friends.incomingRequests.find((request) => request.sender.id === user.model.id);

                if(incomingRequest) {
                    friendUser.friends.incomingRequests.splice(friendUser.friends.incomingRequests.indexOf(incomingRequest), 1);

                    friendUser.sendProtobuff(UserFriendUpdateData, UserFriendUpdateData.create({
                        friend: UserFriends.getFriendData(user.model),
            
                        type: "incoming_request_declined"
                    }));
                }
            }
        }
    }
}
