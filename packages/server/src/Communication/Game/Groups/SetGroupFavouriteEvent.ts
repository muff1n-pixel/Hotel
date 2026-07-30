import { SetGroupFavouriteData, GetUserProfileData } from "@pixel63/events";
import ProtobuffListener from "../../Interfaces/ProtobuffListener";
import User from "../../../Users/User";
import { UserGroupModel } from "../../../Database/Models/Users/Groups/UserGroupModel";
import GetUserProfileEvent from "../Users/Profile/GetUserProfileEvent";

export default class SetGroupFavouriteEvent implements ProtobuffListener<SetGroupFavouriteData> {
    minimumDurationBetweenEvents?: number = 500;

    async handle(user: User, payload: SetGroupFavouriteData): Promise<void> {
        await UserGroupModel.update({
            favourite: false
        }, {
            where: {
                userId: user.model.id
            }
        });

        if(payload.groupId) {
            const group = await UserGroupModel.findOne({
                where: {
                    userId: user.model.id,
                    groupId: payload.groupId
                }
            });

            if(!group) {
                throw new Error("User is not a member of group.");
            }

            await group.update({
                favourite: true
            });
        }

        await new GetUserProfileEvent().handle(user, GetUserProfileData.create({
            userId: user.model.id
        }));
    }
}
