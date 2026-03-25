import AssetFetcher from "@Client/Assets/AssetFetcher";
import Furniture from "@Client/Furniture/Furniture";
import RoomFurnitureSprite from "@Client/Room/Items/Furniture/RoomFurnitureSprite";
import RoomRenderer from "@Client/Room/RoomRenderer";
import ObservableRequiredProperty from "@Client/Utilities/ObservableRequiredProperty";
import { FurnitureData, ShopFeatureConfigurationData, ShopFeatureRoomConfigurationData } from "@pixel63/events";

export default class ShopFeatureImage {
    public canvas: HTMLCanvasElement | undefined;

    public configuration: ObservableRequiredProperty<ShopFeatureConfigurationData>;

    constructor(type: string, configuration?: ShopFeatureConfigurationData) {
        this.configuration = new ObservableRequiredProperty(configuration ?? ShopFeatureConfigurationData.create({
            type,

            backgroundUsed: true,

            primaryBackgroundColor: "#74CDD7",
            secondaryBackgroundColor: "#FFFFFF",

            backgroundStripesUsed: true,

            useFeatureSprite: true,
            featureSpriteColor: "#57E832",
            
            roomUsed: false
        }));

        this.configuration.subscribe(() => this.render());
    }

    public async render() {
        if(!this.canvas) {
            console.warn("No canvas is configured for the shop feature image renderer.");

            return;
        }

        const context = this.canvas.getContext("2d");

        if(!context) {
            return;
        }

        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        if(this.configuration.value.backgroundUsed) {
            context.save();

            const gradient = context.createLinearGradient(context.canvas.width, 0, 0, context.canvas.height);

            if(this.configuration.value.secondaryBackgroundColor) {
                gradient.addColorStop(0, this.configuration.value.secondaryBackgroundColor);
            }

            gradient.addColorStop(1, this.configuration.value.primaryBackgroundColor);

            context.fillStyle = gradient;
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);

            context.restore();
        }

        if(this.configuration.value.backgroundStripesUsed) {
            {
                let accumulatedLineWidth = 0;

                context.save();

                const gradient = context.createLinearGradient(context.canvas.width, 0, 0, context.canvas.height);

                gradient.addColorStop(0, this.configuration.value.primaryBackgroundColor);

                if(this.configuration.value.secondaryBackgroundColor) {
                    gradient.addColorStop(0.5, this.configuration.value.secondaryBackgroundColor);
                }

                context.strokeStyle = gradient;

                for(const lineWidth of [7, 7, 9, 20]) {
                    context.lineWidth = lineWidth;

                    const lineOffset = 10;

                    context.beginPath();

                    context.moveTo(lineWidth + accumulatedLineWidth + context.canvas.width - 120 - lineOffset, 0 - lineOffset - accumulatedLineWidth);
                    context.lineTo(lineWidth + accumulatedLineWidth + context.canvas.width - 120 + 120 + lineOffset, 70 + lineOffset - accumulatedLineWidth);

                    context.closePath();

                    context.stroke();

                    accumulatedLineWidth += lineWidth + 2;
                }

                context.restore();
            }

            {
                let accumulatedLineWidth = 0;

                context.save();

                const gradient = context.createLinearGradient(context.canvas.width, 0, 0, context.canvas.height);

                gradient.addColorStop(0, this.configuration.value.primaryBackgroundColor);

                if(this.configuration.value.secondaryBackgroundColor) {
                    gradient.addColorStop(0.5, this.configuration.value.secondaryBackgroundColor);
                }

                context.strokeStyle = gradient;
                context.globalAlpha = 0.5;

                for(const lineWidth of [7, 7, 9, 20].toReversed()) {
                    context.lineWidth = lineWidth;

                    const lineOffset = 10;

                    context.beginPath();

                    context.moveTo(65 + lineWidth + accumulatedLineWidth - 120 - lineOffset, context.canvas.height - 30 - lineOffset - accumulatedLineWidth);
                    context.lineTo(65 + lineWidth + accumulatedLineWidth - 120 + 120 + lineOffset, context.canvas.height - 30 + 70 + lineOffset - accumulatedLineWidth);

                    context.closePath();

                    context.stroke();

                    accumulatedLineWidth += lineWidth + 2;
                }

                context.restore();
            }
        }

        if(this.configuration.value.useFeatureSprite) {
            const { image: shadowImage } = await AssetFetcher.fetchImageSprite("/assets/shop/features/sprites/featured.png", {
                x: 0,
                y: 0,

                color: "000000"
            });

            const { image } = await AssetFetcher.fetchImageSprite("/assets/shop/features/sprites/featured.png", {
                x: 0,
                y: 0,

                color: this.configuration.value.featureSpriteColor
            });

            const left = Math.floor((context.canvas.width - image.width) / 2);
            const top = Math.floor((context.canvas.height - image.height) / 2);

            context.globalAlpha = 0.05;
            context.drawImage(shadowImage, left, top + 2);

            context.globalAlpha = 1;
            context.drawImage(image, left, top);
        }

        if(this.configuration.value.featureFurniture) {
            const furnitureRenderer = new Furniture(this.configuration.value.featureFurniture.type, 64, undefined, 0, this.configuration.value.featureFurniture.color);
    
            const image = await furnitureRenderer.renderToCanvas({ spritesWithoutInkModes: true });

            const left = Math.floor((context.canvas.width - image.width) / 2);
            const top = Math.floor((context.canvas.height - image.height) / 2);

            context.drawImage(image, left, top);
        }

        if(this.configuration.value.roomUsed && this.configuration.value.room) {
            await ShopFeatureImage.renderRoom(context, this.configuration.value.room);
        }
    }

    public static async renderRoom(context: CanvasRenderingContext2D, data: ShopFeatureRoomConfigurationData) {
        const furnitureItems = data.roomFurniture.toSorted((a, b) => (a.priority + RoomRenderer.getPositionPriority(a.position!)) - (b.priority + RoomRenderer.getPositionPriority(b.position!)));
        const furnitureSprites = await Promise.all(furnitureItems.flatMap(async (furnitureItem) => {
            const furniture = new Furniture(furnitureItem.type, 64, furnitureItem.direction, furnitureItem.animation, furnitureItem.color);

            const sprites = await furniture.render();

            return sprites.map((sprite) => {
                return {
                    ...sprite,
                    furniture,
                    position: furnitureItem.position!,
                    zIndex: furnitureItem.priority + RoomRenderer.getPositionPriority(furnitureItem.position!) + sprite.zIndex
                }
            });
        }));

        for(const sprite of furnitureSprites.flatMap((sprites) => sprites).sort((a, b) => a.zIndex - b.zIndex)) {
            const translatePosition = RoomRenderer.getCoordinatePosition(sprite.position, 1);

            context.save();

            if(sprite.ink) {
                context.globalCompositeOperation = sprite.ink;
            }

            if(sprite.alpha) {
                context.globalAlpha = sprite.alpha / 255;
            }

            context.translate(data.renderedOffsetLeft, data.renderedOffsetTop);

            context.translate(Math.floor(translatePosition.left), Math.floor(translatePosition.top));

            const offset = RoomFurnitureSprite.getDefaultOffsetPosition(sprite.furniture, sprite, 1);

            context.drawImage(sprite.image, Math.floor(offset.left), Math.floor(offset.top), sprite.image.width, sprite.image.height);

            context.restore();
        }
    }

    public toggleBackgroundUsed() {
        this.configuration.value.backgroundUsed = !this.configuration.value.backgroundUsed;
        this.configuration.update();
    }

    public setPrimaryBackgroundColor(color: string) {
        this.configuration.value.primaryBackgroundColor = color;
        this.configuration.update();
    }

    public setSecondaryBackgroundColor(color: string) {
        this.configuration.value.secondaryBackgroundColor = color;
        this.configuration.update();
    }

    public toggleBackgroundStripesUsed() {
        this.configuration.value.backgroundStripesUsed = !this.configuration.value.backgroundStripesUsed;
        this.configuration.update();
    }

    public toggleFeatureSpriteUsed() {
        this.configuration.value.useFeatureSprite = !this.configuration.value.useFeatureSprite;
        this.configuration.update();
    }

    public setFeatureSpriteColor(color: string) {
        this.configuration.value.featureSpriteColor = color;
        this.configuration.update();
    }

    public toggleFeatureFurnitureUsed() {
        if(this.configuration.value.featureFurniture) {
            this.configuration.value.featureFurniture = undefined;
            
            this.configuration.update();
        }
    }

    public setFeatureFurniture(furnitureData: FurnitureData) {
        this.configuration.value.featureFurniture = furnitureData;
        this.configuration.update();
    }

    public toggleRoomUsed() {
        this.configuration.value.roomUsed = !this.configuration.value.roomUsed;
        
        this.configuration.update();
    }

    public setRoom(data: ShopFeatureRoomConfigurationData) {
        this.configuration.value.roomUsed = true;
        this.configuration.value.room = data;
        this.configuration.update();
    }
}
