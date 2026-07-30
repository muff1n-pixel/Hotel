import Furniture from "@Client/Furniture/Furniture";
import RoomFurnitureSprite from "./RoomFurnitureSprite";
import RoomItem from "../RoomItem";
import RoomRenderer from "@Client/Room/RoomRenderer";
import RoomFurniturePlaceholderSprite from "@Client/Room/Items/Furniture/RoomFurniturePlaceholderSprite";
import RoomFurnitureBackgroundSprite from "@Client/Room/Items/Furniture/Background/RoomFurnitureBackgroundSprite";
import AssetFetcher from "@Client/Assets/AssetFetcher";
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

    constructor(public roomRenderer: RoomRenderer, public readonly furnitureRenderer: Furniture, position?: RoomPositionData, private data?: UserFurnitureCustomData) {
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

    public setPosition(position: RoomPositionData | undefined, index?: number): void {
        if(this.furnitureRenderer.data?.index.logic === "furniture_bg") {
            super.setPosition(undefined);
            //this.priority = 0;

            return;
        }

        return super.setPosition(position, index);
    }

    public getDimensions(): RoomPositionData {
        return this.furnitureRenderer.getDimensions();
    }

    render() {
        if(this.furnitureRenderer.data?.index.logic === "furniture_bg") {
            // TODO: don't update the sprite if we don't have to
            if(this.data?.background?.imageUrl) {
                this.setPosition(undefined);
                //this.priority = 0;

                AssetFetcher.fetchImage(this.data.background.imageUrl).then((image) => {
                    this.setSprites([
                        new RoomFurnitureBackgroundSprite(this, image, {
                            x: this.data?.background?.left ?? 0,
                            y: this.data?.background?.top ?? 0,
                            z: this.data?.background?.index ?? 0,
                        })
                    ]);
                });
            }
            else {
                this.setSprites([]);
            }

            return;
        }

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
        
        if(!this.rendering && this.furnitureRenderer.shouldRender()) {
            if(clientInstance.settings.value?.debugRoomRendering) {
                //this.sprites.push(new RoomTextSprite(this, "Rendering"));
            }

            this.rendering = true;

            this.furnitureRenderer.render().then((result) => {
                this.rendering = false;

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
            }).catch(() => {
                this.rendering = false;
            });
        }
        else {
            this.mask?.updateLandscape();
        }
    }

    public setSprites(sprites: RoomSprite[]): void {
        this.mask = sprites.find((sprite) => sprite instanceof RoomFurnitureMaskSprite);

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
    }
}
