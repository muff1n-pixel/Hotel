import { ReactNode } from "react";

export default interface RoomFurnitureLogic {
    isAvailable(): boolean;
    use(tag?: string): void;

    canEdit?(): boolean;
    edit?(): void;

    isContextMenuAvailable?(): boolean;
    getContextMenu?(): ReactNode;
}
