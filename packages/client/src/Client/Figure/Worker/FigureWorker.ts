import FigureRenderer from "../FigureRenderer.js";
import { FigureRenderEvent, FigureRenderResultEvent } from "../Interfaces/FigureRenderEvent.js";
import { FigureRendererSprite } from "./FigureWorkerRenderer.js";

export default class FigureWorker {
    private worker = (() => {
        const worker = new Worker("build/client/Workers/Figure/FigureRendererWorker.js", {
            type: "module"
        });
        
        worker.onmessage = (event: MessageEvent<FigureRenderResultEvent>) => {
            const id = event.data.id;

            if(event.data.type === "canvas") {
                const request = this.canvasRequests.find((request) => request.id === id);

                if(!request) {
                    return;
                }

                request.resolve(event.data.sprites);

                this.canvasRequests.slice(this.canvasRequests.indexOf(request), 1);
            }
            else if(event.data.type === "sprites") {
                const request = this.spritesRequests.find((request) => request.id === id);

                if(!request) {
                    return;
                }

                request.resolve(event.data.sprites);

                this.spritesRequests.slice(this.spritesRequests.indexOf(request), 1);
            }
        };

        return worker;
    })();

    private spritesRequests: {
        id: number;
        resolve: (value: FigureRendererSprite[]) => void;
    }[] = [];

    private canvasRequests: {
        id: number;
        resolve: (value: FigureRendererSprite) => void;
    }[] = [];

    constructor(private readonly terminateOnComplete: boolean) {

    }

    public renderSpritesInWebWorker(figureRenderer: FigureRenderer, frame: number): Promise<FigureRendererSprite[]> {
        return new Promise<FigureRendererSprite[]>((resolve, reject) => {
            const id = Math.random();

            this.spritesRequests.push({
                id,
                resolve
            });

            this.worker.postMessage({
                id,
                frame,

                type: "sprites",

                configuration: figureRenderer.configuration,
                direction: figureRenderer.direction,
                actions: figureRenderer.actions,
            } satisfies FigureRenderEvent);
        });
    }

    public renderInWebWorker(figureRenderer: FigureRenderer, frame: number, cropped: boolean): Promise<FigureRendererSprite> {
        return new Promise<FigureRendererSprite>((resolve, reject) => {
            const id = Math.random();

            this.canvasRequests.push({
                id,
                resolve
            });

            this.worker.postMessage({
                id,
                frame,
                cropped,

                type: "canvas",

                configuration: figureRenderer.configuration,
                direction: figureRenderer.direction,
                actions: figureRenderer.actions,
            } satisfies FigureRenderEvent);
        });
    }

    public terminate() {
        if(!this.terminateOnComplete) {
            return;
        }

        this.worker.terminate();
    }
}