import { FurnitureRendererSprite } from "../Interfaces/FurnitureRendererSprite.js";
import { FurnitureRenderEvent, FurnitureRenderResultEvent } from "../Interfaces/FurnitureRenderEvent.js";
import FurnitureRenderer from "../FurnitureRenderer.js";

export default class FurnitureWorker {
    private static worker = (() => {
        const worker = new Worker("build/client/Workers/Furniture/FurnitureRendererWorker.js", {
            type: "module"
        });
        
        worker.onmessage = (event: MessageEvent<FurnitureRenderResultEvent>) => {
            const id = event.data.id;

            const request = FurnitureWorker.requests.find((request) => request.id === id);

            if(!request) {
                return;
            }

            request.resolve(event.data.sprites);

            FurnitureWorker.requests.slice(FurnitureWorker.requests.indexOf(request), 1);
        };

        return worker;
    })();

    private static requests: {
        id: number;
        resolve: (value: FurnitureRendererSprite) => void;
    }[] = [];

    public static renderSpritesInWebWorker(furnitureRenderer: FurnitureRenderer, frame: number): Promise<FurnitureRendererSprite> {
        return new Promise<FurnitureRendererSprite>((resolve, reject) => {
            const id = Math.random();

            FurnitureWorker.requests.push({
                id,
                resolve
            });

            FurnitureWorker.worker.postMessage({
                id,
            } satisfies FurnitureRenderEvent);
        });
    }
}