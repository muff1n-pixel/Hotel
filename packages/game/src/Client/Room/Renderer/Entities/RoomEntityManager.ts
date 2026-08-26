import RoomItem from "@Client/Room/Items/RoomItem";
import RoomRenderer from "../RoomRenderer";
import RoomFloorItem from "@Client/Room/Items/Map/RoomFloorItem";
import RoomWallItem from "@Client/Room/Items/Map/RoomWallItem";

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
}
