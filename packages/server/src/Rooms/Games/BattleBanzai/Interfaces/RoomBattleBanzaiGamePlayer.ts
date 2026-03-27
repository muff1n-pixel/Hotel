import RoomUser from "../../../Users/RoomUser";
import { RoomBattleBanzaiGameTeam } from "./RoomBattleBanzaiGameTeam"

export type RoomBattleBanzaiGamePlayer = {
    team: RoomBattleBanzaiGameTeam;
    roomUser: RoomUser;
};
