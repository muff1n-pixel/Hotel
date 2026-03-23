import { RoomPointerPosition } from "@Client/Interfaces/RoomPointerPosition";

export default class RoomDoubleClickEvent extends Event {
    constructor(public readonly floorEntity: RoomPointerPosition | null, public readonly otherEntity: RoomPointerPosition | null) {
        super("doubleclick");
    }
}
