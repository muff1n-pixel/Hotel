import { FigureConfiguration, FigurePartKey, FigurePartKeyAbbreviation } from "@shared/interfaces/figure/FigureConfiguration.js";
import FigureWorkerRenderer from "./Worker/FigureWorkerRenderer.js";
import FigureAssets from "@/Assets/FigureAssets.js";
import FigureWorker from "./Worker/FigureWorker.js";

export default class FigureRenderer {
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

    public async render(frame: number) {
        const currentSpriteFrame = FigureWorkerRenderer.getSpriteFrameFromSequence(frame);

        const renderName = `${this.getConfigurationAsString()}_${this.direction}_${currentSpriteFrame}_${this.actions.join('_')}`;

        if(FigureAssets.figureCollection.has(renderName)) {
            return await FigureAssets.figureCollection.get(renderName)!;
        }

        const result = FigureWorker.renderSpritesInWebWorker(this, frame);

        FigureAssets.figureCollection.set(renderName, result);

        return await result;
    }

    public async renderToCanvas(frame: number, cropped: boolean = false) {
        const renderName = `${this.getConfigurationAsString()}_${this.direction}_${FigureWorkerRenderer.getSpriteFrameFromSequence(frame)}_${this.actions.join('_')}`;

        if(!cropped && FigureAssets.figureImage.has(renderName)) {
            return await FigureAssets.figureImage.get(renderName)!;
        }
        
        const result = FigureWorker.renderInWebWorker(this, frame, cropped);
        
        if(!cropped) {
            FigureAssets.figureImage.set(renderName, result);
        }

        return await result;
    }

    public static getConfigurationFromString(figureString: string): FigureConfiguration {
        const parts = figureString.split('.');

        const configuration: FigureConfiguration = [];

        for(let part of parts) {
            const sections = part.split('-');

            configuration.push({
                type: sections[0] as FigurePartKeyAbbreviation,
                setId: sections[1],
                colorIndex: (sections[2])?(parseInt(sections[2])):(undefined)
            });
        }

        return configuration;
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
