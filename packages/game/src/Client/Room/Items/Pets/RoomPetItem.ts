import RoomItemSpriteInterface from "@Client/Room/Interfaces/RoomItemSpriteInterface";
import RoomItem from "../RoomItem";
import RoomRenderer from "@Client/Room/RoomRenderer";
import { RoomPositionData } from "@pixel63/events";
import Pet from "@Client/Pets/Pet";
import RoomPetSprite from "@Client/Room/Items/Pets/RoomPetSprite";
import { clientInstance } from "src";
import RoomTextSprite from "@Client/Room/Items/RoomTextSprite";

export default class RoomPetItem extends RoomItem {
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
        if(this.pet.size !== this.roomRenderer.size) {
            this.pet.size = this.roomRenderer.size;

            this.sprites = [];
        }

        this.pet.frame++;

        if(this.pet.shouldRender()) {
            if(clientInstance.settings.value?.debugRoomRendering) {
                this.sprites.push(new RoomTextSprite(this, "Rendering"));
            }

            this.pet.render().then((sprites) => {
                if(sprites.length) {
                    this.sprites = sprites.map((sprite) => new RoomPetSprite(this, sprite));
                }
            });
        }
    }

    public setPositionPath(fromPosition: RoomPositionData, toPosition: RoomPositionData | RoomPositionData[], delay: number = 0, useAction: boolean = true): void {
        super.setPositionPath(fromPosition, toPosition, 500 - delay);

        if(useAction) {
            this.pet.posture = "mv";
        }
    }

    public finishPositionPath(): void {
        super.finishPositionPath();

        this.pet.posture = "std";
    }
}
