import Furniture, { FurnitureRendererSprite } from "@Client/Furniture/Furniture";
import { FurnitureRenderOptions } from "@Client/Furniture/Renderer/Interfaces/FurnitureRenderer";
import FurnitureParticleSystemParticle from "@Client/Furniture/Renderer/ParticleSystems/FurnitureParticleSystemParticle";
import { FurnitureParticleSystemData } from "@Client/Interfaces/Furniture/FurnitureLogic";
import { FurnitureParticleSystemLogger } from "@pixel63/shared/Logger/Logger";

export default class FurnitureParticleSystemEmitter {
    public readonly id: number;
    private fused: boolean = false;

    private startTimestamp: number;
    private fuseTimestamp: number;

    public y: number;
    private velocityY: number;

    private particles: FurnitureParticleSystemParticle[] = [];
    private emittedParticles: number = 0;

    constructor(public readonly furniture: Furniture, public readonly data: FurnitureParticleSystemData["emitters"][0], public readonly offsetY: number) {
        this.id = data.id;

        this.startTimestamp = performance.now();
        this.fuseTimestamp = this.startTimestamp + (this.data.fuseTime * (1000 / 24));

        this.y = 0;
        this.velocityY = this.data.simulation.force + this.data.simulation.energy * 4;
    }
    
    public async render(result: FurnitureRendererSprite[], options: FurnitureRenderOptions) {
        const rocketSprite = this.getRocketSprite(result);

        if(!rocketSprite) {
            return;
        }

        if(!this.fused && performance.now() >= this.fuseTimestamp) {
            this.fused = true;
        }

        if(this.y === 0) {
            this.y = rocketSprite.y;
        }

        this.velocityY -= this.data.simulation.gravity / 10;
        this.velocityY *= (1 - this.data.simulation.airFriction);

        this.y -= this.velocityY / 20;

        rocketSprite.y = this.y;

        if(this.fused) {
            rocketSprite.alpha = 0;
            
            FurnitureParticleSystemLogger.log("Fused", this.emittedParticles, this.data.maxNumberParticles);
            
            if((this.data.burstPulse === null || this.burstFrame % this.data.burstPulse === 0) && this.emittedParticles < this.data.maxNumberParticles) {
                this.createParticles();
            }

            this.burstFrame++;
        }

        this.particles = this.particles.filter((particle) => !particle.dead);

        for(const particle of this.particles) {
            await particle.render(result, options, rocketSprite);
        }
    }

    private burst: number = 0;
    private burstFrame: number = 0;

    private createParticles() {
        this.burst++;

        for(let index = 0; index < this.data.particlesPerFrame; index++) {
            FurnitureParticleSystemLogger.log("Creating particle");

            this.particles.push(new FurnitureParticleSystemParticle(this));
            
            this.emittedParticles++;
        }
    }

    private getRocketSprite(result: FurnitureRendererSprite[]) {
        const sprite = result.find((sprite) => sprite.layerCode === String.fromCharCode(97 + this.data.spriteId));

        if(!sprite) {
            return null;
        }

        const index = result.indexOf(sprite);

        const rocketSprite = {
            ...sprite
        };

        result[index] = rocketSprite;

        return rocketSprite;
    }
}
