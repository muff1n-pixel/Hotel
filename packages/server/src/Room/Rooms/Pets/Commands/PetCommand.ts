import Command from "../../../Commands/Command";
import Room from "../../Room";
import RoomPet from "../RoomPet";

export default class PetCommand extends Command {
    constructor(room: Room, public readonly roomPet: RoomPet, input: string) {
        super(room, input, undefined)
    }
}
