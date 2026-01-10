import RoomSprite from "@/Room/Items/RoomSprite.js";
import RoomItem from "../Room/Items/RoomItem.js";
import { RoomPosition } from "@/Interfaces/RoomPosition.js";
import { RoomPointerPosition } from "@/Interfaces/RoomPointerPosition.js";

export default class RoomClickEvent extends Event {
    constructor(public readonly floorEntity: RoomPointerPosition | null, public readonly otherEntity: RoomPointerPosition | null) {
        super("click");
    }
}
