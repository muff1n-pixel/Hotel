import { ReactNode } from "react";

export default interface FurnitureLogic {
    isAvailable(): boolean;
    
    use(tag?: string): void;

    isContextMenuAvailable?(): boolean;
    getContextMenu?(): ReactNode;
}
