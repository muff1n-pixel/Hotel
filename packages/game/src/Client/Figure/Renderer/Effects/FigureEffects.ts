import FigureRenderer from "@Client/Figure/Renderer/FigureRenderer";
import FigureEffectData from "@Client/Figure/Renderer/Interfaces/FigureEffectData";
import { AvatarActionData } from "@Client/Interfaces/Figure/Avataractions";
import { FigureAssets } from "@Game/library";
import { FigureRendererOptions } from "../Interfaces/FigureRendererOptions";

export default class FigureEffects {
    public effects: Record<string, FigureEffectData> = {};

    constructor(private readonly figureRenderer: FigureRenderer) {

    }

    public async loadEffects(options: FigureRendererOptions, actionIds: string[], actions: AvatarActionData[]) {
        for(const action of actions) {
            if(!["AvatarEffect", "Dance"].includes(action.id)) {
                continue;
            }

            const actionKey = actionIds.find((actionId) => actionId.split('.')[0] === action.id);

            if(!actionKey) {
                continue;
            }
            
            const id = parseInt(actionKey.split('.')[1]);

            if(action.id === "AvatarEffect") {
                const library = this.getEffectLibrary(id);

                if(!library) {
                    continue;
                }

                if(!this.effects[library.id]) {
                    this.effects[library.id] = {
                        id: library.id,
                        library: library.library,
                        data: await FigureAssets.fetchEffectData(library.library)
                    };

                    await FigureAssets.fetchEffectImage(library.library)
                }
            }
            else if(action.id === "Dance") {
                if(!this.effects[`Dance${id}`]) {
                    this.effects[`Dance${id}`] = {
                        id: id,
                        library: `Dance${id}`,
                        data: await FigureAssets.fetchEffectData(`Dance${id}`)
                    };
                }
            }
        }
    }

    public getEffects(actionIds: string[], actions: AvatarActionData[]) {
        const results = [];
        
        for(const action of actions) {
            if(!["AvatarEffect", "Dance"].includes(action.id)) {
                continue;
            }

            const actionKey = actionIds.find((actionId) => actionId.split('.')[0] === action.id);

            if(!actionKey) {
                continue;
            }
            
            const id = parseInt(actionKey.split('.')[1]);

            if(action.id === "AvatarEffect") {
                const library = this.getEffectLibrary(id);

                if(!library) {
                    continue;
                }

                results.push(this.effects[library.id]);
            }
            else if(action.id === "Dance") {
                results.push(this.effects[`Dance${id}`]);
            }
        }

        return results.filter<FigureEffectData>((value): value is FigureEffectData => value !== undefined);
    }

    public getEffectLibrary(id: number) {
        return FigureAssets.effectmap.find((effect) => effect.id === id);
    }

    public getEffectFrame(frame: number, effect: FigureEffectData) {
        if(!effect?.data.animation) {
            return null;
        }

        const animationFrameIndex = this.figureRenderer.figureAnimations.getCurrentAnimationFrame(frame, effect.data.animation.frames);

        if(!effect.data.animation.frames[animationFrameIndex]) {
            return null;
        }

        return effect.data.animation.frames[animationFrameIndex];
    }

    public getDirectionFromEffect(direction: number, effects: FigureEffectData[]) {
        let mutatedDirection = direction;

        for(const effect of effects) {
            mutatedDirection = direction;

            if(effect?.data.animation?.direction) {
                mutatedDirection += effect.data.animation.direction.offset;

                while(mutatedDirection < 0) {
                    mutatedDirection += 8;
                }
            
                mutatedDirection %= 8;
            }
        }

        return mutatedDirection;
    }

    public getFigureEffectAnimationSprites(actions: AvatarActionData[], effect: FigureEffectData, direction: number, frame: number) {
        if(!effect.data.animation) {
            return [];
        }

        const animationFrameIndex = this.figureRenderer.figureAnimations.getCurrentAnimationFrame(frame, effect.data.animation.frames);

        //console.log("Frame " + this.frame + " becomes " + frame + " (" + effect.data.animation.frames.length + ")");

        const animationFrame = effect.data.animation.frames?.[animationFrameIndex];

        function getIndexForAlignment(alignment: string) {
            switch(alignment) {
                case "top":
                    return 1;

                case "bottom":
                    return -1;

                case "behind": {
                    if(direction > 1 && direction < 5) {
                        return -1;
                    }

                    return 0;
                }
            }

            return 0;
        }

        let animationSprites =
            effect.data.animation.sprites
            .concat(
                effect.data.animation.add.map((add) => {
                    const id = add.base ?? add.id;

                    return {
                        id,
                        member: `std_${id}_1`, // TODO: what's the 1 for?
                        useDirections: true,
                        directions: Array(8).fill(null).map((_, index) => {
                            return {
                                id: index,
                                destinationX: undefined,
                                destinationY: undefined,
                                destinationZ: getIndexForAlignment(add.align)
                            };
                        }),
                        destinationY: (this.figureRenderer.avatarEffect?.destinationY ?? 0)
                    }
                })
            )
            .concat(
                animationFrame?.bodyParts?.filter((bodypart) => bodypart.items && bodypart.items.length > 0).flatMap((bodypart) => {
                    return bodypart.items.map((item) => {
                        const id = item.base ?? item.id;

                        return {
                            id,
                            member: `std_${id}_1`, // TODO: what's the 1 for?
                            useDirections: true,
                            directions: Array(8).fill(null).map((_, index) => {
                                return {
                                    id: index,
                                    destinationX: undefined,
                                    destinationY: undefined,
                                    destinationZ: getIndexForAlignment(item.align)
                                };
                            }),
                            frame: bodypart.frame,
                            destinationY: (this.figureRenderer.avatarEffect?.destinationY ?? 0)
                        }
                    });
                }) ?? []
            );

        if(effect.data.animation?.overrides) {
            const filteredOverrides = effect.data.animation.overrides.filter((override) => actions.some((action) => action.state === override.type));
            
            const sortedOverrides = filteredOverrides.sort((a, b) => {
                const actionA = actions.find((action) => action.state === a.type);
                const actionB = actions.find((action) => action.state === b.type);

                return (actionA?.precedence ?? 0) - (actionB?.precedence ?? 0);
            });

            for(const override of sortedOverrides) {
                const action = actions.find((action) => action.state === override.type);

                if(!action) {
                    continue;
                }

                const animationFrameIndex = this.figureRenderer.figureAnimations.getCurrentAnimationFrame(frame, override.frames);

                const overrideFrame = override.frames[animationFrameIndex];

                if(overrideFrame) {
                    const results = overrideFrame?.bodyParts?.filter((bodypart) => bodypart.items && bodypart.items.length > 0).flatMap((bodypart) => {
                            return bodypart.items.map((item) => {
                                const id = item.base ?? item.id;

                                return {
                                    id,
                                    part: item.id,
                                    frame: bodypart.frame,
                                    member: `${action.assetPartDefinition}_${item.id}_${item.base}`, // TODO: what's the 1 for?
                                    useDirections: true,
                                    destinationY: bodypart.destinationY ?? (this.figureRenderer.avatarEffect?.destinationY ?? 0),
                                    directionOffset: bodypart.directionOffset
                                }
                            });
                        }) ?? [];

                    animationSprites = animationSprites.filter((animationSprite) => !results.some((result) => result.part === animationSprite.part)).concat(results);

                    for(const overrideEffect of overrideFrame.effects) {
                        const overrideAnimationSprites = animationSprites.filter((animationSprite) => animationSprite.id === overrideEffect.id);

                        for(const overrideAnimationSprite of overrideAnimationSprites) {
                            overrideAnimationSprite.frame = overrideEffect.frame;
                            overrideAnimationSprite.destinationY = overrideEffect.destinationY;
                            overrideAnimationSprite.directionOffset = overrideEffect.directionOffset;
                        }
                    }
                }

                break;
            }
        }

        return animationSprites;
    }
}