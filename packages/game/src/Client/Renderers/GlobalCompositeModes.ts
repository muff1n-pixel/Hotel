import { Logger } from "@pixel63/shared/Logger/Logger";
import { BLEND_MODES } from "pixi.js";

export function getGlobalCompositeModeFromInkNumber(ink: number): BLEND_MODES | undefined {
    switch(ink) {
        case 33: // ADD / LIGHTER
            return "add";

        case 8:
            return undefined;

        default:
            Logger.warn(`Ink number ${ink} is not recognized.`);

            return undefined;
    }
}

export function getGlobalCompositeModeFromInk(initialInk?: string): BLEND_MODES | undefined {
    const ink = initialInk?.toLowerCase();

    switch(ink) {
        case "add":
        case "lighter":
            return "add";

        case "subtract":
            return "subtract";

        case "copy":
            return undefined;

        case "multiply":
        case "difference":
        case "overlay":
        case "saturation":
        case "lighten":
        case "darken":
        case "screen":
        case "linear-dodge":
            return ink;

        case "div":
            return "color-dodge";

        case undefined:
            return undefined;

        case "scrn":
            return "screen";

        default:
            Logger.warn(`Ink mode ${ink} is not recognized.`);

            return ink as any;
    }
}

export function getGlobalCompositeModeFromBlendMode(blendMode: BLEND_MODES): GlobalCompositeOperation {
    if(blendMode === "add") {
        return "lighter";
    }

    return blendMode as GlobalCompositeOperation;
}
