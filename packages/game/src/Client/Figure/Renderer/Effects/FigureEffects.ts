import FigureRenderer from "@Client/Figure/Renderer/FigureRenderer";
import FigureEffectData from "@Client/Figure/Renderer/Interfaces/FigureEffectData";
import { AvatarActionData } from "@Client/Interfaces/Figure/Avataractions";
import { FigureAssets } from "src/library";

export default class FigureEffects {
    constructor(private readonly figureRenderer: FigureRenderer) {

    }

    public async getEffects(actionIds: string[], actions: AvatarActionData[]) {
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

                results.push({
                    id: library.id,
                    library: library.library,
                    data: await FigureAssets.getEffectData(library.library)
                });
            }
            else if(action.id === "Dance") {
                results.push({
                    id: id,
                    library: `Dance${id}`,
                    data: await FigureAssets.getEffectData(`Dance${id}`)
                });
            }
        }

        return results;
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
}