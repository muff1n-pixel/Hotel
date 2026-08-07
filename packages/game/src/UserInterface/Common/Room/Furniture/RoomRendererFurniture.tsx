import Furniture from "@Client/Furniture/Furniture";
import FurnitureRenderer from "@Client/Furniture/Renderer/Interfaces/FurnitureRenderer";
import { FigureConfigurationData, FurnitureData, RoomPositionData, UserFurnitureColorTag } from "@pixel63/events";

export type RoomRendererFurnitureProps = {
    id: string;
    furniture: FurnitureData;
    furnitureRenderer?: Furniture;
    animationId?: number;
    externalImage?: string;
    figureConfiguration?: FigureConfigurationData;
    position?: RoomPositionData;
    colorTags?: UserFurnitureColorTag[];
};

