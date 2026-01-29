import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";

export default interface FurnitureLogic {
    isAvailable(): boolean;
    
    use(roomFurniture: RoomInstanceFurniture): void;
}
