import { GetUserFriendsData, RemoveUserFriendData, SearchUserFriendsData, UserFriendsData, UserFriendsSearchData, UserFriendUpdateData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener";
import User from "../../../../Users/User";
import { game } from "../../../..";
import UserFriends from "../../../../Users/Friends/UserFriends";
import { UserModel } from "../../../../Database/Models/Users/UserModel";
import { Op } from "sequelize";

export default class SearchUserFriendsEvent implements ProtobuffListener<SearchUserFriendsData> {
    minimumDurationBetweenEvents?: number = 100;
    
    async handle(user: User, payload: SearchUserFriendsData): Promise<void> {
        const users = await UserModel.findAll({
            where: {
                id: {
                    [Op.not]: user.model.id,
                },
                name: {
                    [Op.like]: `%${payload.name}%`
                },
            },
            limit: 20
        });

        const filteredUsers = users.filter((_user) => !user.friends.friends.some((friend) => friend.friend.id === _user.id));

        user.sendProtobuff(UserFriendsSearchData, UserFriendsSearchData.create({
            users: filteredUsers.map((user) => UserFriends.getFriendData(user))
        }));
    }
}
