import { FiguremapData } from "@Client/Interfaces/Figure/FiguremapData";
import FigureAssets from "../../Assets/FigureAssets";
import ContextNotAvailableError from "../../Exceptions/ContextNotAvailableError";
import { FiguredataData } from "@Client/Interfaces/Figure/FiguredataData";
import { figureRenderPriority } from "../FigureRenderPriority";
import { AvatarActionsData } from "@Client/Interfaces/Figure/Avataractions";
import { FigureData } from "@Client/Interfaces/Figure/FigureData";
import { FigureConfiguration, FigurePartKey, FigurePartKeyAbbreviation } from "@Shared/interfaces/figure/FigureConfiguration";
import FigureWorker from "./FigureWorker";

export type FigureRendererSprite = {
    image: ImageBitmap;
    imageData: ImageData;

    x: number;
    y: number;

    index: number;
}

export default class FigureWorkerRenderer {
    constructor(public readonly configuration: FigureConfiguration, public direction: number, public readonly actions: string[], public readonly frame: number) {

    }

    private getSettypeForPartAndSet(part: FigurePartKeyAbbreviation) {
        return FigureAssets.figuredata!.settypes.find((settype) => settype.type === part);
    }

    private getSetFromSettype(settype: FiguredataData["settypes"][0], setId: string) {
        return settype.sets.find((set) => set.id === setId);
    }

    private getAssetForSetPart(assetId: string, assetType: FigurePartKeyAbbreviation) {
        for(let index = FigureAssets.figuremap!.length - 1; index >= 0; index--) {
            if(FigureAssets.figuremap![index].id.startsWith("hh_human_50")) {
                continue;
            }

            if(FigureAssets.figuremap![index].parts.some((part) => part.id === assetId && part.type === assetType.substring(0, 2))) {
                return FigureAssets.figuremap![index];
            }
        }

        return null;
    }

    public static getSpriteFrameFromSequence(frame: number) {
        const frameSequence = 4;
        const frameRepeat = 2;
        const spriteFrame = Math.floor((frame % (frameSequence * frameRepeat)) / frameRepeat);

        return spriteFrame;
    }

    public async render() {
        const currentSpriteFrame = FigureWorkerRenderer.getSpriteFrameFromSequence(this.frame);

        //const renderName = `${this.getConfigurationAsString()}_${this.direction}_${currentSpriteFrame}_${this.actions.join('_')}`;

        return await new Promise<FigureRendererSprite[]>(async (resolve, reject) => {
            const avatarActionsData = this.getAvatarActionsData(FigureAssets.avataractions, this.actions);

            const renderCache: {
                configurationPart: FigureConfiguration[0],
                setPartData: FiguredataData["settypes"][0]["sets"][0]["parts"][0],
                settypeData: FiguredataData["settypes"][0],
                setPartAssetData: FiguremapData[0]
            }[] = [];

            for(let configurationPart of this.configuration) {
                const settypeData = this.getSettypeForPartAndSet(configurationPart.type);

                if(!settypeData) {
                    continue;
                }

                const setData = this.getSetFromSettype(settypeData, configurationPart.setId);

                if(!setData) {
                    continue;
                }

                for(let setPartData of setData.parts) {
                    if(!setPartData) {
                        continue;
                    }
                    
                    const setPartAssetData = this.getAssetForSetPart(setPartData.id, setPartData.type);

                    if(!setPartAssetData) {
                        continue;
                    }

                    try {
                        renderCache.push({ configurationPart, setPartData, settypeData, setPartAssetData })
                    }
                    catch {
                        continue;
                    }
                }
            }

            const spritePromises: PromiseSettledResult<FigureRendererSprite>[] = await Promise.allSettled(
                renderCache.map(({ configurationPart, setPartData, settypeData, setPartAssetData }) => {
                    return new Promise<FigureRendererSprite>(async (resolve, reject) => {
                        const figureData = await FigureAssets.getFigureData(setPartAssetData.id);

                        const asset = this.getAsset(figureData, avatarActionsData, setPartData, this.direction, currentSpriteFrame);

                        if(!asset) {
                            return reject();
                        }

                        const { actualAssetName, assetData, avatarAction } = asset;

                        const assetSpriteName = `${actualAssetName}_${configurationPart.colorIndex}`;

                        if(FigureAssets.assetSprites.has(assetSpriteName)) {
                            const result = FigureAssets.assetSprites.get(assetSpriteName);

                            if(result) {
                                return resolve(result);
                            }

                            return reject();
                        }

                        const spriteData = figureData.sprites.find((sprite) => sprite.name === (assetData.source ?? assetData.name));

                        if(!spriteData) {
                            FigureAssets.assetSprites.set(assetSpriteName, null);

                            return reject();
                        }

                        const palette = FigureAssets.figuredata.palettes.find((palette) => palette.id === settypeData.paletteId);
                        const paletteColor = palette?.colors.find((color) => color.id === configurationPart.colorIndex);

                        try {
                            const sprite = await FigureAssets.getFigureSprite(setPartAssetData.id, {
                                x: spriteData.x,
                                y: spriteData.y,

                                width: spriteData.width,
                                height: spriteData.height,

                                flipHorizontal: (this.direction > 3 && this.direction < 7)?(!Boolean(assetData.flipHorizontal)):(assetData.flipHorizontal),

                                color: (setPartData.colorable && configurationPart.colorIndex)?(paletteColor?.color):(undefined),

                                ignoreImageData: true
                            });

                            const priorityDirection = (this.direction > 3 && this.direction < 7)?(6 - this.direction):(this.direction);

                            const priorityTypes: Partial<Record<FigurePartKeyAbbreviation, FigurePartKeyAbbreviation>> = {
                                "cp": "ch",
                                "cc": "ch",
                                "lc": "ls",
                                "rc": "rs"
                            };

                            const partPriority = figureRenderPriority[this.getFigureRenderPriority(avatarAction.assetPartDefinition)][priorityDirection.toString()].indexOf(priorityTypes[setPartData.type] ?? setPartData.type);

                            if(partPriority === -1) {
                                return reject();
                            }

                            let x = assetData.x;

                            if((this.direction > 3 && this.direction < 7)) {
                                x = 64 + (assetData.x * -1) - spriteData.width;
                            }

                            const result: FigureRendererSprite = {
                                image: await createImageBitmap(sprite.image),
                                imageData: sprite.imageData,
                                
                                x: x - 32,
                                y: assetData.y + 32,

                                index: partPriority + setPartData.index,
                            };

                            FigureAssets.assetSprites.set(assetSpriteName, result);

                            resolve(result);
                        }
                        catch {
                            reject();
                        }
                    })
                })
            );

            const sprites: FigureRendererSprite[] = spritePromises.filter<PromiseFulfilledResult<FigureRendererSprite>>((result) => result.status === "fulfilled").map((result) => result.value);

            resolve(sprites);
        });
    }

    private getAsset(figureData: FigureData, avatarActions: AvatarActionsData, setPartData: FiguredataData["settypes"][0]["sets"][0]["parts"][0], direction: number, spriteFrame: number) {
        for(const avatarAction of avatarActions) {
            let actualAssetName: string | undefined = undefined;
            let assetName: string;
            let assetData: FigureData["assets"][0] | undefined;

            let spriteData;

            if(direction > 3 && direction < 7) {
                actualAssetName = `h_${avatarAction.assetPartDefinition}_${setPartData.type}_${setPartData.id}_${direction}_${spriteFrame}`;
                assetName = `h_${avatarAction.assetPartDefinition}_${setPartData.type}_${setPartData.id}_${6 - direction}_${spriteFrame}`;
                assetData = figureData.assets.find((asset) => asset.name === assetName);
            
                spriteData = figureData.sprites.find((sprite) => sprite.name === (assetData?.source ?? assetData?.name ?? assetName));

                if(!spriteData) {
                    actualAssetName = `h_${avatarAction.assetPartDefinition}_${setPartData.type}_${setPartData.id}_${direction}_0`;
                    assetName = `h_${avatarAction.assetPartDefinition}_${setPartData.type}_${setPartData.id}_${6 - direction}_0`;
                    assetData = figureData.assets.find((asset) => asset.name === assetName);
                    
                    spriteData = figureData.sprites.find((sprite) => sprite.name === (assetData?.source ?? assetData?.name ?? assetName));
                }
            }
            else {
                assetName = `h_${avatarAction.assetPartDefinition}_${setPartData.type}_${setPartData.id}_${direction}_${spriteFrame}`;
                assetData = figureData.assets.find((asset) => asset.name === assetName);

                spriteData = figureData.sprites.find((sprite) => sprite.name === (assetData?.source ?? assetData?.name ?? assetName));

                if(!spriteData) {
                    assetName = `h_${avatarAction.assetPartDefinition}_${setPartData.type}_${setPartData.id}_${direction}_0`;
                    assetData = figureData.assets.find((asset) => asset.name === assetName);
                
                    spriteData = figureData.sprites.find((sprite) => sprite.name === (assetData?.source ?? assetData?.name ?? assetName));
                }
            }

            if(!assetData) {
                continue;
            }

            if(!spriteData) {
                continue;
            }

            return {
                actualAssetName: actualAssetName ?? assetData.name,
                assetData,
                figureData,
                avatarAction
            };
        }
        
        return null;
    }

    private getAvatarActionsData(avataractions: AvatarActionsData, avatarActions: string[]) {
        let avatarActionsData = avataractions.filter((action) => avatarActions.includes(action.id)).sort((a, b) => a.precedence - b.precedence);
        
        avatarActionsData = avatarActionsData.filter((action) => {
            return !avatarActionsData.some((secondAction) => secondAction.precedence > action.precedence && secondAction.prevents?.includes(action.id))
        });

        return avatarActionsData;
    }

    public async renderToCanvas(cropped: boolean = false) {
        return await new Promise<FigureRendererSprite>(async (resolve, reject) => {
            try {
                const sprites = await this.render();

                let minimumX = 128, minimumY = 128, maximumWidth = 128, maximumHeight = 128;
            
                if(cropped) {
                    minimumX = 0;
                    minimumY = 0;
                    maximumWidth = 0;
                    maximumHeight = 0;

                    for(let sprite of sprites) {
                        if(minimumX < sprite.x * -1) {
                            minimumX = sprite.x * -1;
                        }
                        
                        if(minimumY < sprite.y * -1) {
                            minimumY = sprite.y * -1;
                        }

                        if(sprite.x + sprite.image.width > maximumWidth) {
                            maximumWidth = sprite.x + sprite.image.width;
                        }

                        if(sprite.y + sprite.image.height > maximumHeight) {
                            maximumHeight = sprite.y + sprite.image.height;
                        }
                    }
                }

                const canvas = new OffscreenCanvas(minimumX + maximumWidth, minimumY + maximumHeight);

                if(!sprites.length) {
                    return reject();
                }

                const context = canvas.getContext("2d");

                if(!context) {
                    throw new ContextNotAvailableError();
                }

                sprites.sort((a, b) => a.index - b.index);

                for(let sprite of sprites) {
                    context.drawImage(sprite.image, minimumX + sprite.x, minimumY + sprite.y);
                }

                resolve({
                    image: await createImageBitmap(canvas),
                    imageData: context.getImageData(0, 0, canvas.width, canvas.height),

                    x: -minimumX,
                    y: -minimumY,

                    index: 0
                });
            }
            catch {
                reject();
            }
        });
    }

    public getConfigurationAsString(): string {
        return this.configuration.map((section) => [section.type, section.setId, section.colorIndex].filter(Boolean).join('-')).join('.');
    }

    private getFigureRenderPriority(action: string) {
        switch(action) {
            default:
                return "std";
        }
    }
}
