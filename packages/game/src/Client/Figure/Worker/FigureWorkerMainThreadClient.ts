import Figure from "@Client/Figure/Figure";
import FigureRenderer, { FigureRendererResult } from "@Client/Figure/Renderer/FigureRenderer";
import FigureWorkerInterface from "@Client/Figure/Worker/Interfaces/FigureWorkerInterface";

export default class FigureWorkerMainThread implements FigureWorkerInterface {
    public async renderInWebWorker(figure: Figure, frame: number, cropped: boolean, drawEffects: boolean, useConfigurationEffect: boolean): Promise<FigureRendererResult> {
        if(!figure.configuration) {
            throw new Error();
        }
        
        const figureRenderer = new FigureRenderer(figure.configuration, figure.direction, figure.actions, frame, figure.headOnly);
        
        const result = await figureRenderer.renderToCanvas(cropped, drawEffects, useConfigurationEffect);

        return result;
    }

    public async preload(_figure: Figure): Promise<void> {
        
    }

    public terminate(): void {
        
    }
}
