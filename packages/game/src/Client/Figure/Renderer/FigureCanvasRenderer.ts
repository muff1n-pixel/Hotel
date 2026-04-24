import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import FigureRenderer from "@Client/Figure/Renderer/FigureRenderer";
import { FigureRendererOptions } from "@Client/Figure/Renderer/Interfaces/FigureRendererOptions";
import { FigureLogger } from "@pixel63/shared/Logger/Logger";

export default class FigureCanvasRenderer {
    constructor(private readonly figureRenderer: FigureRenderer) {

    }

    public async renderToCanvas(options: FigureRendererOptions, cropped: boolean = false, drawEffects: boolean = false, useConfigurationEffect: boolean = false, ignoreBodyparts: string[] = [], headOnly?: boolean) {
        return await (async () => {
            const { sprites, effectSprites } = await this.figureRenderer.render(options, useConfigurationEffect || drawEffects, ignoreBodyparts, headOnly);

            let minimumX = -128, minimumY = -128, maximumWidth = 256 + minimumX, maximumHeight = 256 + minimumY;
        
            if(cropped) {
                if(effectSprites.length && !drawEffects) {
                    FigureLogger.warn("Figure render is cropped but contains effect sprites. Effect will not be applied.");
                }

                minimumX = Infinity;
                minimumY = Infinity;
                maximumWidth = -Infinity;
                maximumHeight = -Infinity;

                for(const sprite of sprites) {
                    if(sprite.x < minimumX) {
                        minimumX = sprite.x;
                    }
                    
                    if(sprite.y < minimumY) {
                        minimumY = sprite.y;
                    }

                    if(sprite.x + sprite.image.width > maximumWidth) {
                        maximumWidth = sprite.x + sprite.image.width;
                    }

                    if(sprite.y + sprite.image.height > maximumHeight) {
                        maximumHeight = sprite.y + sprite.image.height;
                    }
                }
            }

            const canvas = new OffscreenCanvas(maximumWidth - minimumX, maximumHeight - minimumY);

            const context = canvas.getContext("2d");

            if(!context) {
                throw new ContextNotAvailableError();
            }

            const mutatedSprites = [...sprites];

            if(drawEffects) {
                mutatedSprites.push(...effectSprites.map((sprite) => {
                    return {
                        ...sprite,
                        index: sprite.index * 100
                    };
                }));
            }

            for(const sprite of mutatedSprites.toSorted((a, b) => a.index - b.index)) {
                context.save();

                if(sprite.alpha) {
                    context.globalAlpha = sprite.alpha;
                }

                if(sprite.ink) {
                    context.globalCompositeOperation = sprite.ink;
                }

                context.drawImage(sprite.image, sprite.x - minimumX, sprite.y - minimumY);

                context.restore();
            }

            if(this.figureRenderer.avatarEffect?.destinationY) {
                minimumY -= this.figureRenderer.avatarEffect.destinationY;
            }

            //Performance.startPerformanceCheck("getImageData", 1);
            //const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
            //Performance.endPerformanceCheck("getImageData");

            //const imageDataArray = new Uint8Array(imageData);
            const imageDataArray = new Uint8Array(256 * 256 * 4).fill(0);

            for(const sprite of sprites) {
                if(sprite.imageData) {
                    for(let x = 0; x < sprite.image.width; x++) {
                        for(let y = 0; y < sprite.image.height; y++) {
                            const alpha = sprite.imageData.data[((x + y * sprite.imageData.width) * 4) + 3];

                            if(alpha > 0) {
                                for(let index = 0; index < 4; index++) {
                                    imageDataArray[(((x + 128 + sprite.x) + (y + 128 + sprite.y) * 256) * 4) + 0] = sprite.imageData.data[((x + y * sprite.imageData.width) * 4) + 0];
                                    imageDataArray[(((x + 128 + sprite.x) + (y + 128 + sprite.y) * 256) * 4) + 1] = sprite.imageData.data[((x + y * sprite.imageData.width) * 4) + 1];
                                    imageDataArray[(((x + 128 + sprite.x) + (y + 128 + sprite.y) * 256) * 4) + 2] = sprite.imageData.data[((x + y * sprite.imageData.width) * 4) + 2];
                                    imageDataArray[(((x + 128 + sprite.x) + (y + 128 + sprite.y) * 256) * 4) + 3] = sprite.imageData.data[((x + y * sprite.imageData.width) * 4) + 3];
                                }
                            }
                        }
                    }
                }
            }

            return {
                figure: {
                    image: canvas.transferToImageBitmap(),
                    imageData: imageDataArray,

                    x: 0,
                    y: this.figureRenderer.avatarEffect?.destinationY ?? 0,

                    index: 0
                },
                effects: effectSprites
            };
        })();
    }
}