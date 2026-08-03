import RoomItem from "../RoomItem";
import RoomRenderer from "@Client/Room/RoomRenderer";
import { RoomPositionData } from "@pixel63/events";
import Pet from "@Client/Pets/Pet";
import RoomPetSprite from "@Client/Room/Items/Pets/RoomPetSprite";
import { clientInstance } from "@Game/index";

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

    private rendering: boolean = false;

    render() {
        if(this.pet.size !== this.roomRenderer.size) {
            this.pet.size = this.roomRenderer.size;

            this.setSprites([]);
        }

        this.pet.frame++;

        if(!this.rendering && this.pet.shouldRender()) {
            if(clientInstance.settings.value?.debugRoomRendering) {
                //this.sprites.push(new RoomTextSprite(this, "Rendering"));
            }

            this.rendering = true;

            if(this.pet.shouldLoadAssets()) {
                this.pet.loadAssets().then(() => this.renderPet());
            }
            else {
                this.renderPet();
            }
        }
    }

    private renderPet() {
        const result = this.pet.render();
        
        if(result.sprites.length) {
            this.setSprites(result.sprites.map((sprite) => new RoomPetSprite(this, sprite)));
        }

        this.rendering = false;
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
