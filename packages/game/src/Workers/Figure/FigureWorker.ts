import FigureAssets from "@Client/Assets/FigureAssets";
import FigureRenderer from "@Client/Figure/Renderer/FigureRenderer";
import { FigureRenderEvent } from "@Client/Figure/Interfaces/FigureRenderEvent";

import "../../Polyfills/OffscreenCanvas";

onmessage = async (event: MessageEvent<FigureRenderEvent>) => {
    const port = event.ports[0];

    await FigureAssets.loadAssets();

    if(event.data.type === "render") {
        const figureRenderer = new FigureRenderer(event.data.configuration, event.data.direction, event.data.actions, event.data.frame, event.data.headOnly);
        
        const { figure, effects } = await figureRenderer.renderToCanvas(event.data.cropped);

        const transferables: Transferable[] = [];

        transferables.push(figure.image);
        transferables.push(figure.imageData.buffer);

        for(const effect of effects) {
            transferables.push(effect.image);
        }
        
        port.postMessage({
            figure,
            effects,
            timestamp: Date.now()
        }, transferables);
    }
    else if(event.data.type === "preload") {
        const figureRenderer = new FigureRenderer(event.data.configuration, 0, [], 0);
        
        await figureRenderer.heavilyPreloadFigureSprites();
        
        port.postMessage(null);
    }

    port.close();
};
