import RoomItem from "@Client/Room/Items/RoomItem";
import RoomRenderer from "../RoomRenderer";
import RoomEntitiesHitTester from "./RoomEntitiesHitTester";

export default class RoomEntityManager {
    public readonly entities: RoomItem[] = [];

    public readonly hitTester: RoomEntitiesHitTester = new RoomEntitiesHitTester(this);

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
