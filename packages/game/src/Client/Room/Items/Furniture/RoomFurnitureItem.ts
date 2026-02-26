import Furniture from "@Client/Furniture/Furniture";
import RoomItemSpriteInterface from "@Client/Room/Interfaces/RoomItemSpriteInterface";
import RoomFurnitureSprite from "./RoomFurnitureSprite";
import RoomItem from "../RoomItem";
import { RoomPosition } from "@Client/Interfaces/RoomPosition";
import RoomRenderer from "@Client/Room/Renderer";
import RoomFurniturePlaceholderSprite from "@Client/Room/Items/Furniture/RoomFurniturePlaceholderSprite";
import RoomFurnitureBackgroundSprite from "@Client/Room/Items/Furniture/Background/RoomFurnitureBackgroundSprite";
import AssetFetcher from "@Client/Assets/AssetFetcher";
import { RoomFurnitureBackgroundData } from "@Shared/Interfaces/Room/Furniture/RoomFurnitureBackgroundData";

export default class RoomFurnitureItem extends RoomItem {
    sprites: RoomItemSpriteInterface[] = [];

    public readonly id = Math.random();

    constructor(public roomRenderer: RoomRenderer, public readonly furnitureRenderer: Furniture, position?: RoomPosition, private data?: unknown) {
        super(roomRenderer, "furniture");

        if(position) {
            this.setPosition(position);
        }

        this.render();
    }
    
    process(frame: number): void {
        super.process(frame);

        this.render();
    }

    public setPosition(position: RoomPosition | undefined, index?: number): void {
        if(this.furnitureRenderer.data?.index.logic === "furniture_bg") {
            this.position = undefined;
            this.priority = 0;

            return;
        }
        
        return super.setPosition(position, index);
    }

    render() {
        if(this.furnitureRenderer.data?.index.logic === "furniture_bg") {
            // TODO: don't update the sprite if we don't have to
            if((this.data as RoomFurnitureBackgroundData)?.imageUrl) {
                this.position = undefined;
                this.priority = 0;

                AssetFetcher.fetchImage((this.data as RoomFurnitureBackgroundData).imageUrl).then((image) => {
                    this.sprites = [new RoomFurnitureBackgroundSprite(this, image, (this.data as RoomFurnitureBackgroundData)?.position)]
                });
            }
            else {
                this.sprites = [];
            }

            return;
        }

        if(this.furnitureRenderer.type !== "tile_cursor") {
            if(this.furnitureRenderer.size !== this.roomRenderer.size) {
                this.furnitureRenderer.size = this.roomRenderer.size;

                this.sprites = [];
            }
        }

        if(!this.sprites.length) {
            this.sprites = [
                new RoomFurniturePlaceholderSprite(this)
            ];
        }

        this.furnitureRenderer.render().then((sprites) => {
            if(sprites.length) {
                this.sprites = sprites.map((sprite) => new RoomFurnitureSprite(this, sprite));
            }
        });
    }

    setData(data: unknown) {
        this.data = data;
    }
}
