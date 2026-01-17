import { FigureConfiguration, FigurePartKey, FigurePartKeyAbbreviation } from "@Shared/interfaces/figure/FigureConfiguration";
import FigureWorkerRenderer from "./Worker/FigureWorkerRenderer";
import FigureAssets from "@Client/Assets/FigureAssets";
import FigureWorker from "./Worker/FigureWorker";

export default class FigureRenderer {
    public static readonly figureWorker: FigureWorker = new FigureWorker(false);

    public static figureItemAbbreviations: Record<FigurePartKey, FigurePartKeyAbbreviation> = {
        hair: "hr",
        leg: "lg",
        shirt: "ch",
        body: "hd",
        shoe: "sh",
        head: "he",
        waist: "wa",
        hat: "ha",
        chest: "ca",
        eye: "ea",
        face: "fa"
    };

    constructor(public readonly configuration: FigureConfiguration, public direction: number, public readonly actions: string[] =  ["Default"]) {

    }

    public async render(figureWorker: FigureWorker, frame: number) {
        const currentSpriteFrame = FigureWorkerRenderer.getSpriteFrameFromSequence(frame);

        const renderName = `${this.getConfigurationAsString()}_${this.direction}_${currentSpriteFrame}_${this.actions.join('_')}`;

        if(FigureAssets.figureCollection.has(renderName)) {
            return await FigureAssets.figureCollection.get(renderName)!;
        }

        const result = figureWorker.renderSpritesInWebWorker(this, frame);

        FigureAssets.figureCollection.set(renderName, result);

        return await result;
    }

    public async renderToCanvas(figureWorker: FigureWorker, frame: number, cropped: boolean = false) {
        let renderName = `${this.getConfigurationAsString()}_${this.direction}_${FigureWorkerRenderer.getSpriteFrameFromSequence(frame)}_${this.actions.join('_')}`;

        if(cropped) {
            renderName += "_cropped";
        }

        if(FigureAssets.figureImage.has(renderName)) {
            return await FigureAssets.figureImage.get(renderName)!;
        }
        
        const result = figureWorker.renderInWebWorker(this, frame, cropped);
        
        FigureAssets.figureImage.set(renderName, result);

        return await result;
    }

    public getConfigurationAsString(): string {
        return this.configuration.map((section) => [section.type, section.setId, section.colorIndex].filter(Boolean).join('-')).join('.');
    }

    public addAction(id: string) {
        if(this.actions.includes(id)) {
            return;
        }

        this.actions.push(id);
    }

    public removeAction(id: string) {
        if(!this.actions.includes(id)) {
            return;
        }

        this.actions.splice(this.actions.indexOf(id), 1);
    }
}
