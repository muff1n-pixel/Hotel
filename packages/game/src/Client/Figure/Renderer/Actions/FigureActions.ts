import FigureBodyPartAction from "@Client/Figure/Renderer/Interfaces/FigureBodyPartAction";
import FigureEffectData from "@Client/Figure/Renderer/Interfaces/FigureEffectData";
import FigureRenderer from "@Client/Figure/Renderer/FigureRenderer";
import { figureGeometryTypes } from "@Client/Figure/Renderer/Geometry/FigureGeometry";
import { figurePartSets } from "@Client/Figure/Renderer/Geometry/FigurePartSets";
import { AvatarActionData, AvatarActionsData } from "@Client/Interfaces/Figure/Avataractions";
import { FigureAnimationData } from "@Client/Interfaces/Figure/FigureAnimationData";
import { FigureLogger } from "@pixel63/shared/Logger/Logger";
import { FigureAssets } from "@Game/library";
import { FigureRendererOptions } from "../Interfaces/FigureRendererOptions";

export default class FigureActions {
    public effectTypeRemaps: Map<string, string> = new Map();
    private avatarActionsData: AvatarActionsData = [];

    constructor(private readonly figureRenderer: FigureRenderer) {

    }

    public getAvatarActions(options: FigureRendererOptions, actions: string[]) {
        const actionIds = new Set(actions.map((action) => action.split('.')[0]));

        if(options.actionsChanged || !this.avatarActionsData.length) {
            const avatarActionsData = FigureAssets.avataractions
                .filter((action) => actionIds.has(action.id))
                .sort((a, b) => a.precedence - b.precedence);

            const prevented = new Set<string>();

            this.avatarActionsData = avatarActionsData.filter((action) => {
                const id = action.id.toLowerCase();

                if(prevented.has(id)) {
                    return false;
                }

                if(action.prevents) {
                    for(const preventedId of action.prevents) {
                        prevented.add(preventedId.toLowerCase());
                    }
                }

                return true;
            });
        }

        return this.avatarActionsData;
    }

    private readonly geometryById = new Map(
        figureGeometryTypes.map(g => [g.id, g])
    );

    private readonly figurePartSetById = new Map(
        figurePartSets.map(p => [p.id, p])
    );
    
public getActionsForBodyParts(
    frame: number,
    actions: AvatarActionData[],
    effects: FigureEffectData[],
    ignoreBodyparts: string[]
): FigureBodyPartAction[] {
    const result: FigureBodyPartAction[] = [];

    const bodyPartsRemoved = new Set(ignoreBodyparts);

    this.effectTypeRemaps = new Map();

    const actionsByState = new Map<string, AvatarActionData>();

    for (const action of actions) {
        actionsByState.set(action.state, action);
    }

    for (const effect of effects) {
        const animation = effect.data.animation;

        if (animation?.remove) {
            for (const remove of animation.remove) {
                bodyPartsRemoved.add(remove.id);
            }
        }

        const effectFrame =
            this.figureRenderer.figureEffects.getEffectFrame(
                frame,
                effect
            );

        if (animation?.overrides) {
            let bestOverride:
                typeof animation.overrides[number] | undefined;

            let bestPrecedence = Number.MAX_SAFE_INTEGER;

            for (const override of animation.overrides) {
                const action = actionsByState.get(override.type);

                if (!action) {
                    continue;
                }

                if (action.precedence < bestPrecedence) {
                    bestPrecedence = action.precedence;
                    bestOverride = override;
                }
            }

            if (bestOverride) {
                const animationFrame =
                    this.figureRenderer.figureAnimations
                        .getCurrentAnimationFrame(
                            frame,
                            bestOverride.frames
                        );

                const overrideFrame =
                    bestOverride.frames[animationFrame];

                if (overrideFrame) {
                    for (const bodyPart of overrideFrame.bodyParts) {
                        for (const item of bodyPart.items) {
                            bodyPartsRemoved.add(item.id);
                        }
                    }

                    const additions =
                        this.getActionsForBodyPartsFromFrames(
                            overrideFrame,
                            Array.from(bodyPartsRemoved)
                        );

                    // Preserve original replacement behavior
                    for (let i = result.length - 1; i >= 0; i--) {
                        if (additions.some(
                            a => a.geometry.id === result[i].geometry.id
                        )) {
                            result.splice(i, 1);
                        }
                    }

                    for (const addition of additions) {
                        result.push(addition);
                    }
                }
            }
        }

        if (effectFrame) {
            const additions =
                this.getActionsForBodyPartsFromFrames(
                    effectFrame,
                    Array.from(bodyPartsRemoved)
                );

            for (const addition of additions) {
                result.push(addition);
            }
        }
    }

    const removedParts = bodyPartsRemoved;

    for (const action of actions) {
        if (action.id === "AvatarEffect" || action.id === "Dance") {
            continue;
        }

        const geometry = this.geometryById.get(action.geometryType);

        if (!geometry) {
            throw new Error("Geometry is not found for action.");
        }

        const figurePartSet =
            this.figurePartSetById.get(action.activePartSet);

        if (!figurePartSet) {
            throw new Error(
                "Action does not have a figure part set in geometry."
            );
        }

        const bodyParts: string[] = [];

        for (const part of figurePartSet.parts) {
            if (!removedParts.has(part)) {
                bodyParts.push(part);
            }
        }

        result.push({
            actionId: action.id,
            geometry,
            assetPartDefinition: action.assetPartDefinition,
            bodyParts,
            destinationY: 0
        });
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

    public getActionId(actions: string[], actionId: string) {
        const actionName = actions.find((action) => action.split('.')[0] === actionId);

        if(!actionName) {
            return null;
        }

        return actionName.split('.')[1];
    }
}