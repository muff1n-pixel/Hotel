import Figure from "@Client/Figure/Figure";
import { FigureRendererResult } from "@Client/Figure/Renderer/FigureRenderer";

export default interface FigureWorkerInterface {
    renderInWebWorker(figureRenderer: Figure, frame: number, cropped: boolean): Promise<FigureRendererResult>;
    
    preload(figure: Figure): Promise<void>;
    
    terminate(): void;
}
