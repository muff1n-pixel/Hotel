import { UserFriendData, UserFriendsData } from "@pixel63/events";
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
            friends: this.friends.map((friend) => this.getFriendData(friend.friend)),

            incomingRequests: this.incomingRequests.map((request) => this.getFriendData(request.sender)),
            outgoingRequests: this.outgoingRequests.map((request) => this.getFriendData(request.receiver))
        }));
    }

    public getFriendData(user: UserModel): UserFriendData {
        return UserFriendData.create({
            id: user.id,
            
            name: user.name,
            
            figureConfiguration: user.figureConfiguration,

            online: game.users.some((_user) => _user.model.id === user.id),
            lastOnline: user.lastLogin?.toString()
        });
    }
}
