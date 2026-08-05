import { UpdateUserFriendRelationshipData } from "@pixel63/events";
import { UserProtobuffListener } from "../../../Interfaces/UserProtobuffListener";
import User from "../../../../Users/User";
import { UserFriendModel } from "../../../../../Database/Models/Users/Friends/UserFriendModel";

export default class UpdateUserFriendRelationshipEvent implements UserProtobuffListener<UpdateUserFriendRelationshipData> {
    minimumDurationBetweenEvents?: number = 100;

    async handle(user: User, payload: UpdateUserFriendRelationshipData): Promise<void> {
        const friend = await UserFriendModel.findOne({
            where: {
                userId: user.model.id,
                friendId: payload.userId
            }
        });

        if(!friend) {
            throw new Error("Users are not friends.");
        }

        await friend.update({
            relationship: payload.relationship
        });
    }
}
