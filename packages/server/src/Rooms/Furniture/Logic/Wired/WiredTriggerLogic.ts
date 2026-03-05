import RoomUser from "../../../Users/RoomUser.js";
import RoomFurniture from "../../RoomFurniture.js";
import WiredLogic from "./WiredLogic.js";

export default class WiredTriggerLogic extends WiredLogic {
    handleUserWalksOnFurniture?(roomUser: RoomUser, roomFurniture: RoomFurniture): Promise<void>;
    handleUserWalksOffFurniture?(roomUser: RoomUser, roomFurniture: RoomFurniture): Promise<void>;
}