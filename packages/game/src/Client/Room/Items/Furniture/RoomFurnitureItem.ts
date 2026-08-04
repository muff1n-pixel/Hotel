import Furniture from "@Client/Furniture/Furniture";
import RoomFurnitureSprite from "./RoomFurnitureSprite";
import RoomItem from "../RoomItem";
import RoomRenderer from "@Client/Room/RoomRenderer";
import RoomFurniturePlaceholderSprite from "@Client/Room/Items/Furniture/RoomFurniturePlaceholderSprite";
import { RoomPositionData, UserFurnitureCustomData } from "@pixel63/events";
import { clientInstance } from "@Game/index";
import FurnitureMannequinRenderer from "@Client/Furniture/Renderer/FurnitureMannequinRenderer";
import FurnitureExternalImageRenderer from "@Client/Furniture/Renderer/FurnitureExternalImageRenderer";
import RoomSprite from "@Client/Room/Items/RoomSprite";
import RoomFurnitureMaskSprite from "@Client/Room/Items/Furniture/RoomFurnitureMaskSprite";

export default class RoomFurnitureItem extends RoomItem {
    public readonly id = Math.random();
    
    private mask?: RoomFurnitureMaskSprite;

    private rendering: boolean = false;

    constructor(public roomRenderer: RoomRenderer, public readonly furnitureRenderer: Furniture, position?: RoomPositionData, public data?: UserFurnitureCustomData) {
        super(roomRenderer, "furniture");

        if(position) {
            this.setPosition(position);
        }
    }
    
    process(frame: number): void {
        super.process(frame);
        
        if(this.furnitureRenderer.type === "tile_cursor") {
            if(this.position) {
                const upmostFurniture = clientInstance.roomInstance.value?.getFurnitureAtUpmostPosition(this.position, undefined, this.id);

                const sprite = this.sprites.find<RoomFurnitureSprite>((sprite): sprite is RoomFurnitureSprite => sprite instanceof RoomFurnitureSprite && sprite.furnitureSprite.zIndex === 101);

                if(sprite) {
                    if(upmostFurniture?.item.position && upmostFurniture.furnitureData.flags?.walkable) {
                        sprite.offset.top = sprite.defaultOffset.top;
                        sprite.offset.top += -((upmostFurniture.item.position.depth + upmostFurniture.getDimensionDepth()) * 32);
                        sprite.offset.top += this.position.depth * 32;
                    
                        sprite.alpha = 1;
                    }
                    else {
                        sprite.alpha = 0;
                    }

                    sprite.update();
                }
            }
        }

        this.render();
    }

    public getDimensions(): RoomPositionData {
        return this.furnitureRenderer.getDimensions();
    }

    render(forceRender?: boolean) {
        /*if(this.furnitureRenderer.type !== "tile_cursor") {
            if(this.furnitureRenderer.size !== this.roomRenderer.size) {
                this.furnitureRenderer.size = this.roomRenderer.size;

                this.sprites = [];
            }
        }*/

        if(!this.sprites.length) {
            this.setSprites([
                new RoomFurniturePlaceholderSprite(this)
            ]);
        }

        this.furnitureRenderer.frame++;
        
        if(!this.rendering && (this.furnitureRenderer.shouldRender() || forceRender)) {
            if(clientInstance.settings.value?.debugRoomRendering) {
                //this.sprites.push(new RoomTextSprite(this, "Rendering"));
            }

            this.rendering = true;

            if(this.furnitureRenderer.shouldLoadAssets()) {
                this.furnitureRenderer.loadAssets().then(() => this.renderFurniture());
            }
            else {
                this.renderFurniture();
            }
        }
        else {
            console.log("update landscape");
            this.mask?.updateLandscape();
        }
    }

    private renderFurniture() {
        const result = this.furnitureRenderer.render();

        if(this.furnitureRenderer.placement === "wall") {
            this.calculatedPriority = this.roomRenderer.getItemCalculatedPriority(this);
        }        
        
        if(result.sprites.length) {
            const sprites: RoomSprite[] = result.sprites.map((sprite) => new RoomFurnitureSprite(this, sprite));

            if(result.mask) {
                sprites.push(new RoomFurnitureMaskSprite(this, result.mask));
            }

            this.setSprites(sprites);
        }

        this.rendering = false;
    }

    public setSprites(sprites: RoomSprite[]): void {
        this.mask = sprites.find((sprite) => sprite instanceof RoomFurnitureMaskSprite);

        this.hasLandscapeMask = this.mask !== undefined;

        return super.setSprites(sprites);
    }

    setData(data: UserFurnitureCustomData) {
        this.data = data;

        if(this.furnitureRenderer.renderer instanceof FurnitureMannequinRenderer) {
            this.furnitureRenderer.figureConfiguration = this.data.mannequin?.figureConfiguration;
        }

        if(this.furnitureRenderer.renderer instanceof FurnitureExternalImageRenderer) {
            this.furnitureRenderer.externalImage = this.data.externalImage?.externalImage;
        }

        if(this.data.background) {
            this.render(true);
        }
    }
}
