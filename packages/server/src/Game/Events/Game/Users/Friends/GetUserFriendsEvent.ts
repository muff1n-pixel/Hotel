import { GetUserFriendsData } from "@pixel63/events";
import { UserProtobuffListener } from "../../../Interfaces/UserProtobuffListener";
import User from "../../../../Users/User";

export default class GetUserFriendsEvent implements UserProtobuffListener<GetUserFriendsData> {
    minimumDurationBetweenEvents?: number = 200;
    
    async handle(user: User, payload: GetUserFriendsData): Promise<void> {
        user.friends.sendFriendsData();
    }
}
