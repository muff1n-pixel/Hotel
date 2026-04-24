import FigureBodyPartAction from "@Client/Figure/Renderer/Interfaces/FigureBodyPartAction";
import FigureEffectData from "@Client/Figure/Renderer/Interfaces/FigureEffectData";
import FigureRenderer from "@Client/Figure/Renderer/FigureRenderer";
import { figureGeometryTypes } from "@Client/Figure/Renderer/Geometry/FigureGeometry";
import { figurePartSets } from "@Client/Figure/Renderer/Geometry/FigurePartSets";
import { AvatarActionData } from "@Client/Interfaces/Figure/Avataractions";
import { FigureAnimationData } from "@Client/Interfaces/Figure/FigureAnimationData";
import { FigureLogger } from "@pixel63/shared/Logger/Logger";
import { FigureAssets } from "src/library";

export default class FigureActions {
    public effectTypeRemaps: Map<string, string> = new Map();

    constructor(private readonly figureRenderer: FigureRenderer) {

    }

    public getAvatarActions(actions: string[]) {
        let avatarActionsData = FigureAssets.avataractions.filter((action) => actions.some((id) => id.split('.')[0] === action.id)).sort((a, b) => a.precedence - b.precedence);
        
        avatarActionsData = avatarActionsData.filter((action) => {
            return !avatarActionsData.some((secondAction) => {
                return secondAction.precedence < action.precedence && (secondAction.prevents?.includes(action.id.toLowerCase()))
            })
        });

        return avatarActionsData;
    }
    
    public async getActionsForBodyParts(frame: number, actions: AvatarActionData[], effects: FigureEffectData[], ignoreBodyparts: string[]) {
        let result: FigureBodyPartAction[] = [];
        const bodyPartsRemoved: string[] = ignoreBodyparts;
        this.effectTypeRemaps = new Map();

        for(const effect of effects) {
            if(effect.data.animation?.remove) {
                bodyPartsRemoved.push(...effect.data.animation.remove.map((remove) => remove.id));
            }

            const effectFrame = this.figureRenderer.figureEffects.getEffectFrame(frame, effect);

            // effect says bodypart id rightarm (geometry bodypart) is used for action CarryItem
            // CarryItem says handRight is used for activePartSet

            if(effect.data.animation?.overrides) {
                const filteredOverrides = effect.data.animation.overrides.filter((override) => actions.some((action) => action.state === override.type));
                
                const sortedOverrides = filteredOverrides.sort((a, b) => {
                    const actionA = actions.find((action) => action.state === a.type);
                    const actionB = actions.find((action) => action.state === b.type);

                    return (actionA?.precedence ?? 0) - (actionB?.precedence ?? 0);
                });

                for(const override of sortedOverrides) {
                    if(!actions.some((action) => action.state === override.type)) {
                        continue;
                    }

                    const animationFrame = this.figureRenderer.figureAnimations.getCurrentAnimationFrame(frame, override.frames);

                    const overrideFrame = override.frames[animationFrame];

                    bodyPartsRemoved.push(...overrideFrame.bodyParts.flatMap((bodypart) => bodypart.items.map((item) => item.id)));

                    if(overrideFrame) {
                        const additions = this.getActionsForBodyPartsFromFrames(overrideFrame, bodyPartsRemoved);

                        result = result.filter((result) => !additions.some((addition) => addition.geometry.id === result.geometry.id)).concat(additions);
                    }

                    break;
                }
            }

            if(effectFrame) {
                result.push(...this.getActionsForBodyPartsFromFrames(effectFrame, bodyPartsRemoved));
            }
        }

        for(const action of actions) {
            if(action.id === "AvatarEffect" || action.id === "Dance") {
                continue;
            }

            const geometry = figureGeometryTypes.find((geometry) => geometry.id === action.geometryType);
            
            if(!geometry) {
                throw new Error("Geometry is not found for action.");
            }

            const figurePartSet = figurePartSets.find((figurePartSet) => figurePartSet.id === action.activePartSet);

            if(!figurePartSet) {
                throw new Error("Action does not have a figure part set in geometry.");
            }

            result.push({
                actionId: action.id,
                geometry,
                assetPartDefinition: action.assetPartDefinition,
                bodyParts: figurePartSet.parts.filter((part) => !bodyPartsRemoved.includes(part)),
                destinationY: 0,//(action.assetPartDefinition === "sit")?(16):(0),
            });

            // now we know walk is occupied by Move to use `wlk`
            // walk consists of figurePartSets->walk->["bd", ...]

            // now we know figure is occupied by Default to use `std`
            // figure consists of figurePartSets->figure->[...]
        }

        return result;
    }
    
    public getActionsForBodyPartsFromFrames(effectFrame: FigureAnimationData["frames"][0], bodyPartsRemoved: string[]) {
        const result: FigureBodyPartAction[] = [];

        for(const effectBodyPart of effectFrame.bodyParts) {
            const action = FigureAssets.avataractions.find((avatarAction) => avatarAction.id === effectBodyPart.action);

            const geometry = figureGeometryTypes.find((geometry) => geometry.id === (action?.geometryType ?? "vertical"));

            if(!geometry) {
                throw new Error("Action does not have a geometry type.");
            }

            const geometryBodyparts = geometry.bodyparts.find((bodypart) => bodypart.id === effectBodyPart.id);

            if(!geometryBodyparts) {
                FigureLogger.warn("Action does not have a geometry bodyparts.", { effectBodyPart });

                continue;
            }

            for(const item of effectBodyPart.items) {
                if(item.base) {
                    this.effectTypeRemaps.set(item.id, item.base);
                }
            }

            result.push({
                actionId: action?.id ?? "Default",
                geometry,
                assetPartDefinition: action?.assetPartDefinition ?? "std",
                bodyParts: geometryBodyparts.parts.filter((part) => !bodyPartsRemoved.includes(part)).concat(effectBodyPart.items.map((item) => item.id)),
                frame: effectBodyPart.frame,
                destinationX: effectBodyPart.destinationX,
                destinationY: effectBodyPart.destinationY,
                directionOffset: effectBodyPart.directionOffset
            });

            // now we know handRight is occupied by CarryItem to use `crr`
            // handRight consists of figurePartSets->handRight->[ "rh", "rhs", "rs", "rc", "ri" ]
        }

        return result;
    }

    public getActionParamId(actions: string[], actionId: string) {
        const actionName = actions.find((action) => action.split('.')[0] === actionId);

        if(!actionName) {
            return null;
        }

        const action = FigureAssets.avataractions.find((action) => action.id === actionId);

        if(!action?.params.length) {
            return null;
        }

        const param = action.params.find((param) => param.id === actionName.split('.')[1]);

        if(!param) {
            return null;
        }

        return param.value;
    }
}