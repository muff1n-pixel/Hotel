import { FigureConfiguration } from "@Shared/Interfaces/Figure/FigureConfiguration";
import { FigureRendererSpriteResult } from "../Renderer/FigureRenderer";

export type FigureRenderEvent = {
    type: "render";
    configuration: FigureConfiguration;
    direction: number;
    frame: number;
    actions: string[];
    cropped?: boolean;
    headOnly?: boolean;
} | {
    type: "preload";
    configuration: FigureConfiguration;
};

export type FigureRenderResultEvent = {
    id: number;
    figure: FigureRendererSpriteResult;
    effects: FigureRendererSpriteResult[];
};
