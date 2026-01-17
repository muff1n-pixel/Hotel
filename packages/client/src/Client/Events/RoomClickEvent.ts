import RoomSprite from "@Client/Room/Items/RoomSprite";
import RoomItem from "../Room/Items/RoomItem";
import { RoomPosition } from "@Client/Interfaces/RoomPosition";
import { RoomPointerPosition } from "@Client/Interfaces/RoomPointerPosition";

export default class RoomClickEvent extends Event {
    constructor(public readonly floorEntity: RoomPointerPosition | null, public readonly otherEntity: RoomPointerPosition | null) {
        super("click");
    }
}
