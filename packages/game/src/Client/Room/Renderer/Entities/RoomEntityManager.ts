import RoomItem from "@Client/Room/Items/RoomItem";
import RoomRenderer from "../RoomRenderer";
import RoomFloorItem from "@Client/Room/Items/Map/RoomFloorItem";
import RoomWallItem from "@Client/Room/Items/Map/RoomWallItem";
import { MousePosition } from "@Client/Interfaces/MousePosition";
import { ShopFeatureRoomConfigurationData } from "@pixel63/events";
import RoomFurnitureItem from "@Client/Room/Items/Furniture/RoomFurnitureItem";

export default class RoomEntityManager {
    public floorItem?: RoomFloorItem;
    public wallItem?: RoomWallItem;

    public readonly entities: RoomItem[] = [];

    constructor(public readonly renderer: RoomRenderer) {

    }

    public addEntity(entity: RoomItem) {
        if(this.entities.includes(entity)) {
            return;
        }
        
        this.entities.push(entity);
    }

    public removeEntity(entity: RoomItem) {
        const index = this.entities.indexOf(entity);
        
        if(index === -1) {
            return;
        }
        
        this.entities.splice(index, 1);

        entity.destroy();
    }

    public hasLandscapeMask() {
        return this.entities.some((item) => item.hasLandscapeMask);
    }

    public captureItems(element: HTMLElement, width: number, height: number) {
        const clientRectangle = element.getBoundingClientRect();

        if(!clientRectangle) {
            throw new Error("Bounding client rectangle is not available.");
        }

        const minimumLeft = Math.floor(clientRectangle.left);
        const minimumTop = Math.floor(clientRectangle.top);

        const offsetMousePosition = {
            left: minimumLeft - this.renderer.camera.cameraPosition.left,
            top: minimumTop - this.renderer.camera.cameraPosition.top
        };

        const scale = 1; /*this.getSizeScale()*/;

        const filteredItems = this.entities.filter((item) => {
            return item.sprites.some((sprite) => {
                const relativeMousePosition: MousePosition = {
                    left: offsetMousePosition.left,
                    top: offsetMousePosition.top
                };

                if(sprite.item.position) {
                    relativeMousePosition.left = offsetMousePosition.left - (Math.floor(-(sprite.item.position.row * 32) + (sprite.item.position.column * 32) - 64)) * scale;
                    relativeMousePosition.top = offsetMousePosition.top - (Math.floor((sprite.item.position.column * 16) + (sprite.item.position.row * 16) - ((Math.round(sprite.item.position.depth * 1000) / 1000) * 32))) * scale;
                }

                return sprite.isPositionInsideBounds?.(relativeMousePosition, {
                    left: relativeMousePosition.left + width,
                    top: relativeMousePosition.top + height
                });
            })
        });

        return ShopFeatureRoomConfigurationData.create({
            renderedOffsetLeft: this.renderer.camera.cameraPosition.left,
            renderedOffsetTop: this.renderer.camera.cameraPosition.top,

            roomFurniture: filteredItems.filter((item) => item instanceof RoomFurnitureItem).map((item) => {
                return {
                    animation: item.furnitureRenderer.animation,
                    color: item.furnitureRenderer.color,
                    direction: item.furnitureRenderer.direction,
                    type: item.furnitureRenderer.type,
                    position: item.position,
                    priority: item.priority
                };
            })
        });
    }
}
