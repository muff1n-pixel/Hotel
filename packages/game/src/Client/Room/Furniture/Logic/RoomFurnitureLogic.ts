import { ReactNode } from "react";

export default interface RoomFurnitureLogic {
    isAvailable(): boolean;
    
    use(tag?: string): void;

    isContextMenuAvailable?(): boolean;
    getContextMenu?(): ReactNode;
}
