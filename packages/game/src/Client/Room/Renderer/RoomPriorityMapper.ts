import { RoomPositionData } from "@pixel63/events";
import RoomFurnitureItem from "../Items/Furniture/RoomFurnitureItem";
import RoomItem from "../Items/RoomItem";
import RoomPriority from "../Items/RoomPriority";
import RoomSprite from "../Items/RoomSprite";
import RoomRenderer from "./RoomRenderer";

export default class RoomPriorityMapper {
    constructor(private readonly renderer: RoomRenderer) {

    }
    
    public getSpritePriority(sprite: RoomSprite) {
        return sprite.item.calculatedPriority + sprite.priority;
    }

    public getItemCalculatedPriority(item: RoomItem) {
        let priority = item.priority;

        if(item.position) {
            if(Math.round(item.position.row) === this.renderer.structure.data.door?.row && Math.round(item.position.column) === this.renderer.structure.data.door.column) {
                if(this.renderer.entityManager.wallItem && this.renderer.entityManager.wallItem.wallRenderer.hasDoorWall) {
                    priority = RoomPriority.getDoorPositionPriority(item.position);
                
                    return priority;
                }
            }

            if(item instanceof RoomFurnitureItem) {
                if(item.furnitureRenderer.placement === "wall") {
                    priority = RoomPriority.WALL_FURNITURE_SPRITE_PRIORITY + RoomPriorityMapper.getPositionPriority(item.position, !item.positionPathData);
                    priority += (item.position.depth * 100);
                }
                else {
                    priority += RoomPriorityMapper.getPositionPriority(item.position, !item.positionPathData);
                }
            }
            else {
                priority += RoomPriorityMapper.getPositionPriority(item.position);

                if(item.type === "figure" && item.positionPathData) {
                    priority += 10;
                }
            }
        }

        return priority;
    }

    public static getPositionPriority(position: RoomPositionData, floored: boolean = true) {
        const row = (floored)?(Math.round(position.row)):(position.row);
        const column = (floored)?(Math.round(position.column)):(position.column);

        return (row * 1000) + (column * 1000) + (position.depth * 10);
    }
}
