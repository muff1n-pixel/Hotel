import RoomUser from "../../../Users/RoomUser";
import RoomFurniture from "../../RoomFurniture";
import WiredLogic from "./WiredLogic";

export default class WiredTriggerLogic<T> extends WiredLogic<T> {
    handleUserWalksOnFurniture?(roomUser: RoomUser, roomFurniture: RoomFurniture): Promise<void>;
    handleUserWalksOffFurniture?(roomUser: RoomUser, roomFurniture: RoomFurniture): Promise<void>;
}