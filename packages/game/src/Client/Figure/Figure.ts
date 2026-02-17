import FigureAssets from "@Client/Assets/FigureAssets";
import FigureWorkerClient from "./Worker/FigureWorkerClient";
import { FigureConfiguration } from "@Shared/Interfaces/Figure/FigureConfiguration";

export default class Figure {
    public static readonly figureWorker: FigureWorkerClient = new FigureWorkerClient(false);

    public actions: string[] = ["Default"]

    constructor(public configuration: FigureConfiguration, public direction: number, actions: string[] = [], public headOnly: boolean = false) {
        this.actions.push(...actions);
    }

    public async renderToCanvas(worker: FigureWorkerClient, frame: number, cropped: boolean = false) {
        let renderName = `${this.getConfigurationAsString()}_${this.direction}_${frame}_${this.actions.join('_')}`;

        if(this.headOnly) {
            renderName += "_headonly";
        }

        if(cropped) {
            renderName += "_cropped";
        }

        if(FigureAssets.figureImage.has(renderName)) {
            return await FigureAssets.figureImage.get(renderName)!;
        }
        
        const result = worker.renderInWebWorker(this, frame, cropped);
        
        FigureAssets.figureImage.set(renderName, result);

        return await result;
    }

    public getConfigurationAsString(): string {
        return this.configuration.parts.map((section) => [section.type, section.setId, ...section.colors].filter(Boolean).join('-')).join('.');
    }

    public addAction(id: string) {
        if(this.actions.includes(id)) {
            return;
        }

        this.actions.push(id);
    }

    public removeAction(id: string) {
        const actionId = id.split('.')[0];

        const actionIndex = this.actions.findIndex((action) => action.split('.')[0] === actionId);

        if(actionIndex === -1) {
            return;
        }

        this.actions.splice(actionIndex, 1);
    }
}
