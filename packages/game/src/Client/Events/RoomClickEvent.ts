import { RoomPointerPosition } from "@Client/Interfaces/RoomPointerPosition";

export default class RoomClickEvent extends Event {
    constructor(
        public readonly floorEntity: RoomPointerPosition | null,
        public readonly otherEntity: RoomPointerPosition | null,
        public readonly shiftKey: boolean,
        public readonly ctrlKey: boolean,
        public readonly altKey: boolean,
    ) {
        super("click");
    }
}
