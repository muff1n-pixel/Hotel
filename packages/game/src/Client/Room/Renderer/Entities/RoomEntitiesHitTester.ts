import RoomItem from "@Client/Room/Items/RoomItem";
import RoomEntityManager from "./RoomEntityManager";
import { RoomPointerPosition } from "@Client/Interfaces/RoomPointerPosition";
import { MousePosition } from "@Client/Interfaces/MousePosition";

export default class RoomEntitiesHitTester {
    constructor(private readonly entityManager: RoomEntityManager) {

    }

    public getEntityAtMousePosition(filter?: (item: RoomItem) => boolean): RoomPointerPosition | null {
        if(!this.entityManager.renderer.camera.mousePosition) {
            return null;
        }

        const offsetMousePosition = this.entityManager.renderer.camera.getMouseOffsetPosition();

        if(!offsetMousePosition) {
            return null;
        }

        let filteredItems = this.entityManager.entities;

        if(filter) {
            filteredItems = filteredItems.filter(filter);
        }

        const scale = 1; // this.getSizeScale();

        const sprites = filteredItems.flatMap((item) => item.sprites).sort((a, b) => this.entityManager.renderer.getSpritePriority(b) - this.entityManager.renderer.getSpritePriority(a));

        for(let index = 0; index < sprites.length; index++) {
            const sprite = sprites[index];

            const relativeMousePosition: MousePosition = {
                left: offsetMousePosition.left,
                top: offsetMousePosition.top
            };

            if(sprite.item.position) {
                relativeMousePosition.left = offsetMousePosition.left - ((Math.floor(-(sprite.item.position.row * 32) + (sprite.item.position.column * 32) - 64)) * scale);
                relativeMousePosition.top = offsetMousePosition.top - ((Math.floor((sprite.item.position.column * 16) + (sprite.item.position.row * 16) - ((Math.round(sprite.item.position.depth * 1000) / 1000) * 32))) * scale);
            }

            const tile = sprite.mouseover(relativeMousePosition);

            if(tile) {
                return {
                    item: sprite.item,
                    sprite: sprite,
                    position: tile
                }
            }
        }

        return null;
    }
}
