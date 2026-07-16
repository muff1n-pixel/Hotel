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

export default class RoomFurnitureItem extends RoomItem {
    public readonly id = Math.random();

    constructor(public roomRenderer: RoomRenderer, public readonly furnitureRenderer: Furniture, position?: RoomPositionData, private data?: UserFurnitureCustomData) {
        super(roomRenderer, "furniture");

        if(position) {
            this.setPosition(position);
        }

        this.render();
    }
    
    process(frame: number): void {
        super.process(frame);

        
        if(this.furnitureRenderer.type === "tile_cursor") {
            if(this.position) {
                const upmostFurniture = clientInstance.roomInstance.value?.getFurnitureAtUpmostPosition(this.position, undefined, this.id);

                if(upmostFurniture?.item.position && upmostFurniture.furnitureData.flags?.walkable) {
                    const sprite = this.sprites.find<RoomFurnitureSprite>((sprite): sprite is RoomFurnitureSprite => sprite instanceof RoomFurnitureSprite && sprite.furnitureSprite.zIndex === 101);

                    if(sprite) {
                        sprite.offset.top = sprite.defaultOffset.top;
                        sprite.offset.top += -((upmostFurniture.item.position.depth + upmostFurniture.getDimensionDepth()) * 32);
                        sprite.offset.top += this.position.depth * 32;
                    }
                }
                else {
                    return;
                }
            }
        }

        this.render();
    }

    public setPosition(position: RoomPositionData | undefined, index?: number): void {
        if(this.furnitureRenderer.data?.index.logic === "furniture_bg") {
            //this.position = undefined;
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
                //this.position = undefined;
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

        if(this.furnitureRenderer.shouldRender()) {
            if(clientInstance.settings.value?.debugRoomRendering) {
                //this.sprites.push(new RoomTextSprite(this, "Rendering"));
            }

            this.furnitureRenderer.render().then((sprites) => {
                if(sprites.length) {
                    this.setSprites(sprites.map((sprite) => new RoomFurnitureSprite(this, sprite)));
                }
            });
        }
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
