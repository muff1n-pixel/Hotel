import Figure from "../Figure";
import { FigureRenderEvent } from "../Interfaces/FigureRenderEvent";
import { FigureRendererResult } from "../Renderer/FigureRenderer";

export default class FigureWorkerClient {
    private worker = new Worker(new URL("/src/Workers/Figure/FigureWorker.ts", import.meta.url), {
            type: "module"
        });

    public preload(figure: Figure) {
        const channel = new MessageChannel();

        this.worker.postMessage({
            type: "preload",

            configuration: figure.configuration
        } satisfies FigureRenderEvent, [channel.port1]);

        return new Promise<void>((resolve, reject) => {
            channel.port2.onmessage = () => {
                resolve();
            };

            channel.port2.onmessageerror = () => {
                reject();
            }
        });
    }

    public renderInWebWorker(figureRenderer: Figure, frame: number, cropped: boolean): Promise<FigureRendererResult> {
        const channel = new MessageChannel();

        this.worker.postMessage({
            type: "render",

            frame,
            cropped,

            configuration: figureRenderer.configuration,
            direction: figureRenderer.direction,
            actions: figureRenderer.actions,
            headOnly: figureRenderer.headOnly,
        } satisfies FigureRenderEvent, [channel.port1]);

        return new Promise((resolve, reject) => {
            channel.port2.onmessage = (event) => {
                resolve(event.data);
            };

            channel.port2.onmessageerror = () => {
                reject();
            }
        });
    }

    public terminate() {
        this.worker.terminate();
    }
}