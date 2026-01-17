import { FigureConfiguration } from "@Shared/interfaces/figure/FigureConfiguration";
import { FigureRendererSprite } from "../Worker/FigureWorkerRenderer";

export type FigureRenderEvent = {
    id: number;
    type: "canvas" | "sprites";
    configuration: FigureConfiguration;
    direction: number;
    frame: number;
    actions: string[];
    cropped?: boolean;
};

export type FigureRenderResultEvent = {
    id: number;
} & (
    {
        type: "sprites";
        sprites: FigureRendererSprite[];
    } |
    {
        type: "canvas";
        sprites: FigureRendererSprite;
    }
);
