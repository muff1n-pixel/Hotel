import Furniture, { FurnitureRendererSprite } from "@Client/Furniture/Furniture";
import { FurnitureRenderOptions } from "@Client/Furniture/Renderer/Interfaces/FurnitureRenderer";
import FurnitureParticleSystemEmitter from "@Client/Furniture/Renderer/ParticleSystems/FurnitureParticleSystemEmitter";
import { FurnitureParticleSystemData } from "@Client/Interfaces/Furniture/FurnitureLogic";

export default class FurnitureParticleSystem {
    private emitters: FurnitureParticleSystemEmitter[] = [];

    constructor(private readonly furniture: Furniture, private readonly data: FurnitureParticleSystemData) {
    }

    public shouldRender(options: FurnitureRenderOptions) {
        return true;
    }

    public async render(result: FurnitureRendererSprite[], options: FurnitureRenderOptions) {
        for(const emitterData of this.data.emitters) {
            const existingEmitter = this.emitters.find((emitter) => emitter.id === emitterData.id);

            if(emitterData.id === options.animation) {
                if(!existingEmitter) {
                    this.emitters.push(new FurnitureParticleSystemEmitter(this.furniture, emitterData, this.data.offsetY));
                }
            }
            else {
                if(existingEmitter) {
                    this.emitters.splice(this.emitters.indexOf(existingEmitter), 1);
                }
            }
    
        }

        for(const emitter of this.emitters) {
            await emitter.render(result, options);
        }
    }
}
