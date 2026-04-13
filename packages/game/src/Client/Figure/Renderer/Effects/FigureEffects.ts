import FigureRenderer from "@Client/Figure/Renderer/FigureRenderer";
import FigureEffectData from "@Client/Figure/Renderer/Interfaces/FigureEffectData";
import { AvatarActionData } from "@Client/Interfaces/Figure/Avataractions";
import { FigureAssets } from "src/library";

export default class FigureEffects {
    constructor(private readonly figureRenderer: FigureRenderer) {

    }

    public async getEffects(actions: AvatarActionData[]) {
        const results = [];
        
        for(const action of actions) {
            if(!["AvatarEffect", "Dance"].includes(action.id)) {
                continue;
            }

            const actionKey = this.figureRenderer.actions.find((actionId) => actionId.split('.')[0] === action.id);

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

    public getEffectFrame(effect: FigureEffectData) {
        if(!effect?.data.animation) {
            return null;
        }

        const frame = this.figureRenderer.figureAnimations.getCurrentAnimationFrame(effect.data.animation.frames);

        if(!effect.data.animation.frames[frame]) {
            return null;
        }

        return effect.data.animation.frames[frame];
    }

    public getDirectionFromEffect(effects: FigureEffectData[]) {
        let direction = this.figureRenderer.direction;

        for(const effect of effects) {
            direction = this.figureRenderer.direction;

            if(effect?.data.animation?.direction) {
                direction += effect.data.animation.direction.offset;

                while(direction < 0) {
                    direction += 8;
                }
            
                direction %= 8;
            }
        }

        return direction;
    }
}