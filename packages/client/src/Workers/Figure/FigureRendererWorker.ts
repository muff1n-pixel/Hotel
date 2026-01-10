import FigureAssets from "@/Assets/FigureAssets.js";
import FigureRenderer from "@/Figure/FigureRenderer.js";
import FigureWorkerRenderer from "@/Figure/Worker/FigureWorkerRenderer.js";

onmessage = async (event) => {
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
