import { FigureConfigurationData } from "@pixel63/events";
import { FigureRendererSpriteResult } from "../Renderer/FigureRenderer";

export type FigureRenderEvent = {
    type: "render";
    configuration: FigureConfigurationData;
    direction: number;
    frame: number;
    actions: string[];
    cropped?: boolean;
    headOnly?: boolean;
} | {
    type: "preload";
    configuration: FigureConfigurationData;
};

export type FigureRenderResultEvent = {
    id: number;
    figure: FigureRendererSpriteResult;
    effects: FigureRendererSpriteResult[];
};
