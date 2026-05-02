import { FigureConfigurationData } from "@pixel63/events";
import FigureRenderer, { FigureRendererResult } from "@Client/Figure/Renderer/FigureRenderer";
import { FigureRendererOptions } from "@Client/Figure/Renderer/Interfaces/FigureRendererOptions";

export default class Figure {
    public actions: string[] = ["Default"];

    private renderer: FigureRenderer;

    constructor(public configuration: FigureConfigurationData | undefined, public direction: number, actions: string[] = [], public headOnly: boolean = false) {
        this.actions.push(...actions);

        this.renderer = new FigureRenderer(this.configuration!);
    }

    public async renderToCanvas(frame: number, cropped: boolean = false, drawEffects: boolean = false, useConfigurationEffect: boolean = false, ignoreBodyparts: string[] = []): Promise<FigureRendererResult> {
        this.renderer.configuration = this.configuration!;

        return await this.renderer.renderToCanvas(this.getOptions(frame), cropped, drawEffects, useConfigurationEffect, ignoreBodyparts, this.headOnly);
    }

    public getConfigurationAsString(): string {
        if(!this.configuration) {
            return "";
        }
        
        return this.configuration.parts.map((section) => [section.type, section.setId, ...section.colors].filter(Boolean).join('-')).join('.');
    }

    public addAction(id: string) {
        if(this.actions.includes(id)) {
            return;
        }

        this.actions.push(id);
    }

    public hasAction(id: string) {
        return this.actions.some((action) => action.split('.')[0] === id);
    }

    public setActions(actions: string[]) {
        this.actions = actions.concat("Default");
    }

    public removeAction(id: string) {
        const actionId = id.split('.')[0];

        const actionIndex = this.actions.findIndex((action) => action.split('.')[0] === actionId);

        if(actionIndex === -1) {
            return;
        }

        this.actions.splice(actionIndex, 1);
    }

    private getOptions(frame: number): FigureRendererOptions {
        return {
            frame,

            actions: this.actions,
            direction: this.direction
        };
    }
}
