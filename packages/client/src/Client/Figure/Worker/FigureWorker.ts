import FigureRenderer from "../FigureRenderer.js";
import { FigureRendererSprite } from "./FigureWorkerRenderer.js";

export default class FigureWorker {
    private static worker = (() => {
        const worker = new Worker("build/client/Workers/Figure/FigureRendererWorker.js", {
            type: "module"
        });
        
        worker.onmessage = (event) => {
            const id = event.data.id;

            if(event.data.type === "canvas") {
                const request = FigureWorker.canvasRequests.find((request) => request.id === id);

                if(!request) {
                    return;
                }

                request.resolve(event.data.sprites);

                FigureWorker.canvasRequests.slice(FigureWorker.canvasRequests.indexOf(request), 1);
            }
            else if(event.data.type === "sprites") {
                const request = FigureWorker.spritesRequests.find((request) => request.id === id);

                if(!request) {
                    return;
                }

                request.resolve(event.data.sprites);

                FigureWorker.spritesRequests.slice(FigureWorker.spritesRequests.indexOf(request), 1);
            }
        };

        return worker;
    })();

    private static spritesRequests: {
        id: number;
        resolve: (value: FigureRendererSprite[]) => void;
    }[] = [];

    private static canvasRequests: {
        id: number;
        resolve: (value: FigureRendererSprite) => void;
    }[] = [];

    public static renderSpritesInWebWorker(figureRenderer: FigureRenderer, frame: number): Promise<FigureRendererSprite[]> {
        return new Promise<FigureRendererSprite[]>((resolve, reject) => {
            const id = Math.random();

            FigureWorker.spritesRequests.push({
                id,
                resolve
            });

            FigureWorker.worker.postMessage({
                id,
                frame,

                type: "sprites",

                configuration: figureRenderer.configuration,
                direction: figureRenderer.direction,
                actions: figureRenderer.actions,
            });
        });
    }

    public static renderInWebWorker(figureRenderer: FigureRenderer, frame: number, cropped: boolean): Promise<FigureRendererSprite> {
        return new Promise<FigureRendererSprite>((resolve, reject) => {
            const id = Math.random();

            FigureWorker.canvasRequests.push({
                id,
                resolve
            });

            FigureWorker.worker.postMessage({
                id,
                frame,
                cropped,

                type: "canvas",

                configuration: figureRenderer.configuration,
                direction: figureRenderer.direction,
                actions: figureRenderer.actions,
            });
        });
    }
}