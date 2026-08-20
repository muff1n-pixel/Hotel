import RoomItem from "../RoomItem";
import RoomRenderer from "@Client/Room/RoomRenderer";
import { RoomPositionData } from "@pixel63/events";
import Pet from "@Client/Pets/Pet";
import RoomPetSprite from "@Client/Room/Items/Pets/RoomPetSprite";
import { clientInstance } from "@Game/index";
import RoomPetExperiencePointsSprite from "./Sprites/RoomPetExperiencePointsSprite";
import RoomSprite from "../RoomSprite";

export default class RoomPetItem extends RoomItem {
    public readonly id = Math.random();

    public experiencePointsSprite?: RoomPetExperiencePointsSprite;

    constructor(public roomRenderer: RoomRenderer, public readonly pet: Pet, position?: RoomPositionData) {
        super(roomRenderer, "pet");

        if(position) {
            this.setPosition(position);
        }

        this.render(0);
    }
    
    process(frame: number): void {
        super.process(frame);

        this.render(frame);
    }

    private rendering: boolean = false;

    render(frame: number) {
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
                this.pet.loadAssets().then(() => this.renderPet(frame));
            }
            else {
                this.renderPet(frame);
            }
        }
        else {
            this.experiencePointsSprite?.updateFrame();
        }
    }

    private renderPet(frame: number) {
        const result = this.pet.render();
        
        if(result.sprites.length) {
            this.setSprites(result.sprites.map((sprite) => new RoomPetSprite(this, sprite)));

            this.experiencePointsSprite?.updateFrame();
        }

        this.rendering = false;
    }
    
    public setSprites(sprites: RoomSprite[]): void {
        const allSprites = sprites;

        if(this.experiencePointsSprite?._sprite.visible) {
            allSprites.push(this.experiencePointsSprite);
        }
        
        super.setSprites(allSprites);
    }

    public setExperiencePointsSprite(experience: number) {
        if(this.experiencePointsSprite) {
            this.experiencePointsSprite.destroy();
            
            this._sprites = this.sprites.filter((sprite) => !(sprite instanceof RoomPetExperiencePointsSprite));
        }

        this.experiencePointsSprite = new RoomPetExperiencePointsSprite(this, experience);

        this.sprites.push(this.experiencePointsSprite);
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
