import { FurnitureData, RoomPositionData } from "@pixel63/events";

export type RoomRendererFurnitureProps = {
    id: string;
    furniture: FurnitureData;
    position?: RoomPositionData;
    panToItem?: boolean;
};

