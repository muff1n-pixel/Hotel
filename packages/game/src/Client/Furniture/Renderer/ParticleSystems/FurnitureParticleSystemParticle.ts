import FurnitureAssets from "@Client/Assets/FurnitureAssets";
import { FurnitureRendererSprite } from "@Client/Furniture/Furniture";
import { FurnitureRenderOptions } from "@Client/Furniture/Renderer/Interfaces/FurnitureRenderer";
import FurnitureParticleSystemEmitter from "@Client/Furniture/Renderer/ParticleSystems/FurnitureParticleSystemEmitter";
import { FurnitureParticleSystemData } from "@Client/Interfaces/Furniture/FurnitureLogic";
import { FurnitureParticleSystemLogger } from "@pixel63/shared/Logger/Logger";

export default class FurnitureParticleSystemParticle {
    private readonly particle: FurnitureParticleSystemData["emitters"][0]["particles"][0];

    public dead: boolean = false;

    private age: number;
    private lifetime: number;

    private x: number;
    private y: number;

    private velocityX: number;
    private velocityY: number;

    private direction: number = Math.random() * Math.PI * 2;

    constructor(
        public readonly emitter: FurnitureParticleSystemEmitter
    ) {
        this.particle = this.emitter.data.particles[Math.floor(Math.random() * this.emitter.data.particles.length)];

        this.x = 0;
        this.y = this.emitter.y;

        this.age = 0;
        this.lifetime = this.particle.lifetime;

        const speed = Math.random() * (this.emitter.data.simulation.energy * 10) * 0.66;
        
        this.velocityX = Math.cos(this.direction) * speed;
        this.velocityY = Math.sin(this.direction) * speed;
    }

    public async render(result: FurnitureRendererSprite[], options: FurnitureRenderOptions, rocketSprite: FurnitureRendererSprite) {
        this.age++;

        if(this.age >= this.lifetime + 5) {
            this.dead = true;

            return;
        }

        const sprite = await this.getSprite();

        if(!sprite) {
            return;
        }

        FurnitureParticleSystemLogger.log("Log");

        this.velocityX *= (1 - this.emitter.data.simulation.airFriction);

        this.velocityY -= this.emitter.data.simulation.gravity / 10;
        this.velocityY *= (1 - this.emitter.data.simulation.airFriction);

        this.x -= this.velocityX / 20;
        this.y -= this.velocityY / 20;

        sprite.x = this.x - Math.floor(sprite.image.width / 2);
        sprite.y = this.y - Math.floor(sprite.image.height / 2);

        if(this.age >= this.lifetime) {
            sprite.alpha = (1 - ((this.age - this.lifetime) / 5)) * 255;
        }

        result.push(sprite);
    }

    private sprite?: FurnitureRendererSprite;
    private spriteAssetName?: string;

    private async getSprite() {
        const assetName = this.particle.frames[Math.min(this.age, this.particle.frames.length)];

        if(this.sprite && this.spriteAssetName === assetName?.name) {
            return this.sprite;
        }

        const data = await this.emitter.furniture.getData();
        const assetData = data.assets.find((asset) => asset.name === assetName?.name);

        if(!assetData) {
            return;
        }

        const spriteData = data.sprites.find((sprite) => sprite.name === (assetData?.source ?? assetName?.name));
        
        if(!spriteData) {
            return;
        }

        const { image, imageData } = await FurnitureAssets.getFurnitureSprite(this.emitter.furniture.type, {
            x: spriteData.x,
            y: spriteData.y,

            width: spriteData.width,
            height: spriteData.height,
        });

        const assetSprite: FurnitureRendererSprite = {
            image,
            imageData,
            
            x: 0,
            y: 0,

            zIndex: 0,
            alpha: 255,
            ignoreMouse: true,

            layerCode: ""
        };

        this.sprite = assetSprite;
        this.spriteAssetName = assetName.name;

        return assetSprite;
    }
}
