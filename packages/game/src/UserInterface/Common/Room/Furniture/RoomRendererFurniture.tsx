import { FigureConfigurationData, FurnitureData, RoomPositionData } from "@pixel63/events";

export type RoomRendererFurnitureProps = {
    id: string;
    furniture: FurnitureData;
    externalImage?: string;
    figureConfiguration?: FigureConfigurationData;
    position?: RoomPositionData;
    panToItem?: boolean;
};

