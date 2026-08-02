import ProtobuffListener from "@Client/Communications/ProtobuffListener";
import { clientInstance } from "@Game/index";
import { UserHabboClubData } from "@pixel63/events";

export default class UserHabboClubEvent implements ProtobuffListener<UserHabboClubData> {
    async handle(payload: UserHabboClubData) {
        clientInstance.userHabboClub.value = payload;
    }
}
