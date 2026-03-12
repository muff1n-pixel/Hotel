import RoomInstance from "@Client/Room/RoomInstance";
import { UserPetData } from "@pixel63/events";
import Pet from "@Client/Pets/Pet";
import RoomPetItem from "@Client/Room/Items/Pets/RoomPetItem";

export default class RoomPet {
    public readonly pet: Pet;
    public readonly item: RoomPetItem;

    constructor(private readonly instance: RoomInstance, public data: UserPetData) {
        this.pet = new Pet(this.data.pet!.type, this.data.pet?.palettes);
        this.item = new RoomPetItem(this.instance.roomRenderer, this.pet, this.data.position);

        this.instance.roomRenderer.items.push(this.item);

        this.updateData(data);
    }

    public updateData(data: UserPetData) {        
        this.data = data;

        this.item.pet.direction = this.data.direction = data.direction;

        if(data.position) {
            this.item.setPosition(data.position);
        }
    }
}
