import { FigureConfigurationData, RoomPositionData } from "@pixel63/events";

export type RoomRendererFigureProps = {
    id: string;
    figureConfiguration: FigureConfigurationData;
    actions?: string[];
    position?: RoomPositionData;
};

