import { UserFriendData, UserFriendsData, UserFriendUpdateData } from "@pixel63/events";
import { UserFriendModel } from "../../Database/Models/Users/Friends/UserFriendModel";
import { UserFriendRequestModel } from "../../Database/Models/Users/Friends/UserFriendRequestModel";
import { UserModel } from "../../Database/Models/Users/UserModel";
import User from "../User";
import { game } from "../..";

export default class UserFriends {
    public friends: UserFriendModel[] = [];

    public incomingRequests: UserFriendRequestModel[] = [];
    public outgoingRequests: UserFriendRequestModel[] = [];

    constructor(private readonly user: User) {

    }

    public async loadFriends() {
        const [ friends, incomingRequests, outgoingRequests ] = await Promise.all([
            UserFriendModel.findAll({
                where: {
                    userId: this.user.model.id
                },
                include: [
                    {
                        model: UserModel,
                        as: "friend"
                    }
                ]
            }),

            UserFriendRequestModel.findAll({
                where: {
                    receiverId: this.user.model.id
                },
                include: [
                    {
                        model: UserModel,
                        as: "sender"
                    }
                ]
            }),

            UserFriendRequestModel.findAll({
                where: {
                    senderId: this.user.model.id
                },
                include: [
                    {
                        model: UserModel,
                        as: "receiver"
                    }
                ]
            })
        ]);

        this.friends = friends;

        this.incomingRequests = incomingRequests;
        this.outgoingRequests = outgoingRequests;
    }

    public sendFriendsData() {
        this.user.sendProtobuff(UserFriendsData, UserFriendsData.create({
            friends: this.friends.map((friend) => UserFriends.getFriendData(friend.friend)),

            incomingRequests: this.incomingRequests.map((request) => UserFriends.getFriendData(request.sender)),
            outgoingRequests: this.outgoingRequests.map((request) => UserFriends.getFriendData(request.receiver))
        }));
    }

    public updateFriends() {
        const friendData = UserFriends.getFriendData(this.user.model);

        for(const friend of this.friends) {
            const friendUser = game.getUserById(friend.friend.id);

            if(friendUser) {
                friendUser.sendProtobuff(UserFriendUpdateData, UserFriendUpdateData.create({
                    friend: friendData,

                    type: "friend"
                }));
            }
        }
    }

    public static getFriendData(user: UserModel): UserFriendData {
        const gameUser = game.users.find((_user) => _user.model.id === user.id);

        return UserFriendData.create({
            id: user.id,
            
            name: user.name,
            
            figureConfiguration: user.figureConfiguration,

            online: Boolean(gameUser),
            lastOnline: user.lastLogin?.toISOString(),
            roomId: gameUser?.room?.model.id
        });
    }
}
