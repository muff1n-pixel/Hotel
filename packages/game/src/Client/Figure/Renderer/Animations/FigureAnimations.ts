import FigureRenderer from "@Client/Figure/Renderer/FigureRenderer";
import { FigureAnimationData } from "@Client/Interfaces/Figure/FigureAnimationData";
import { FigureAssets } from "src/library";

export default class FigureAnimations {
    constructor(private readonly figureRenderer: FigureRenderer) {

    }

    public getAvatarAnimation(actionId: string, geometryBodyPart: string | undefined, setType: string, direction: number, frame: number) {
        const actionAnimation = FigureAssets.avatarAnimations.actions.find((actionAnimation) => actionAnimation.id === actionId);

        if(!actionAnimation) {
            return null;
        }

        const actionAnimationSettype = actionAnimation.parts.find((part) => part.setType === setType);

        if(!actionAnimationSettype) {
            return null;
        }

        const totalFrames = actionAnimationSettype.frames.reduce((previousValue, currentValue) => {
            return previousValue + (currentValue.repeats ?? 1);
        }, 0);


        const actualFrame = Math.floor((frame / 2) % totalFrames);

        let temporaryFrame = 0;
        let spriteFrame = 0;
        let assetPartDefinition: string | null = null;

        for(let index = 0; index < actionAnimationSettype.frames.length; index++) {
            //console.log({ actualFrame, temporaryFrame, maxFrame: (temporaryFrame + (actionAnimationSettype.frames[index].repeats ?? 0)) });

            if(actualFrame >= temporaryFrame && actualFrame <= (temporaryFrame + (actionAnimationSettype.frames[index].repeats ?? 0))) {
                spriteFrame = actionAnimationSettype.frames[index].number;
                assetPartDefinition = actionAnimationSettype.frames[index].assetPartDefinition;
                
                //console.log("break", spriteFrame);

                break;
            }

            temporaryFrame += 1;
            temporaryFrame += actionAnimationSettype.frames[index].repeats ?? 0;
        }

        const offset = actionAnimation.offsets.find((offset) => offset.frame === spriteFrame);
        const offsetDirection = offset?.directions.find((offsetDirection) => offsetDirection.id === direction);
        const useOffsetDirectionBodypart = offsetDirection?.bodypart.id === geometryBodyPart;

        return {
            spriteFrame,
            assetPartDefinition,
            destinationX: (useOffsetDirectionBodypart)?(offsetDirection?.bodypart.destinationX):(undefined),
            destinationY: (useOffsetDirectionBodypart)?(offsetDirection?.bodypart.destinationY):(undefined)
        };
    }

    public getCurrentAnimationFrame(frames: FigureAnimationData["frames"]) {
        const frameSequence = frames.length;
        const frameRepeat = 2;
        const spriteFrame = Math.floor((this.figureRenderer.frame % (frameSequence * frameRepeat)) / frameRepeat);

        return spriteFrame;
    }

    public static getSpriteFrameFromSequence(frame: number) {
        const frameSequence = 4;
        const frameRepeat = 2;
        const spriteFrame = Math.floor((frame % (frameSequence * frameRepeat)) / frameRepeat);

        return spriteFrame;
    }
}