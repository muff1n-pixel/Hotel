import RoomItemSpriteInterface from "@Client/Room/Interfaces/RoomItemSpriteInterface";
import RoomItem from "../RoomItem";
import RoomRenderer from "@Client/Room/Renderer";
import { RoomPositionData } from "@pixel63/events";
import Pet from "@Client/Pets/Pet";
import RoomPetSprite from "@Client/Room/Items/Pets/RoomPetSprite";

export default class RoomPetItem extends RoomItem {
    sprites: RoomItemSpriteInterface[] = [];

    public readonly id = Math.random();

    constructor(public roomRenderer: RoomRenderer, public readonly pet: Pet, position?: RoomPositionData) {
        super(roomRenderer, "pet");

        if(position) {
            this.setPosition(position);
        }

        this.render();
    }
    
    process(frame: number): void {
        super.process(frame);

        this.render();
    }

    render() {
        this.pet.render().then((sprites) => {
            if(sprites.length) {
                this.sprites = sprites.map((sprite) => new RoomPetSprite(this, sprite));
            }
        });
    }
}
