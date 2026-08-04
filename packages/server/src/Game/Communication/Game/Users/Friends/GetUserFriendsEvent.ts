import { GetUserFriendsData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener";
import User from "../../../../Users/User";

export default class GetUserFriendsEvent implements ProtobuffListener<GetUserFriendsData> {
    minimumDurationBetweenEvents?: number = 200;
    
    async handle(user: User, payload: GetUserFriendsData): Promise<void> {
        user.friends.sendFriendsData();
    }
}
