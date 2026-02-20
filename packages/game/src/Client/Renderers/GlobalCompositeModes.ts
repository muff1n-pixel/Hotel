export function getGlobalCompositeModeFromInkNumber(ink: number): GlobalCompositeOperation | undefined {
    switch(ink) {
        case 33: // ADD
            return "lighter";

        default:
            console.warn(`Ink number ${ink} is not recognized.`);

            return undefined;
    }
}

export function getGlobalCompositeModeFromInk(initialInk?: string): GlobalCompositeOperation | undefined {
    const ink = initialInk?.toLowerCase();

    switch(ink) {
        case "add":
            return "lighter";

        case "subtract":
            return "luminosity";

        case "copy":
            return "source-over";

        case "difference":
        case "overlay":
        case "saturation":
        case "lighter":
        case "lighten":
        case "darken":
        case "screen":
            return ink;

        case undefined:
            return undefined;

        case "scrn":
            return "screen";

        default:
            console.warn(`Ink mode ${ink} is not recognized.`);

            return undefined;
    }
}
