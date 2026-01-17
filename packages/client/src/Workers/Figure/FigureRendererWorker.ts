import FigureAssets from "@Client/Assets/FigureAssets";
import FigureWorkerRenderer from "@Client/Figure/Worker/FigureWorkerRenderer";
import { FigureRenderEvent } from "@Client/Figure/Interfaces/FigureRenderEvent";

onmessage = async (event: MessageEvent<FigureRenderEvent>) => {
    await FigureAssets.loadAssets();

    const figureRenderer = new FigureWorkerRenderer(event.data.configuration, event.data.direction, event.data.actions, event.data.frame);
    
    if(event.data.type === "sprites") {
        const data = await figureRenderer.render();
        
        postMessage({
            id: event.data.id,
            type: "sprites",
            sprites: data
        });
    }
    else if(event.data.type === "canvas") {
        const data = await figureRenderer.renderToCanvas(event.data.cropped);
        
        postMessage({
            id: event.data.id,
            type: "canvas",
            sprites: data
        });
    }
};
