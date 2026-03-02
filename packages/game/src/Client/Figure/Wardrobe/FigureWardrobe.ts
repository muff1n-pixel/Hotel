import FigureAssets from "@Client/Assets/FigureAssets";
import { createFigureWorkerClient } from "../Worker/FigureWorkerClient";
import Figure from "../Figure";

export type FigureWardrobeItem = {
    image: Promise<ImageBitmap>;
    setId: string;
    colorable: boolean;
    colorIndexes: number;
};

export type FigureWardrobeColor = {
    id: number;
    color?: string;
};

export default class FigureWardrobe {
    public static figureWorker = createFigureWorkerClient();

    public static async getWardrobePartTypes(part: string, colors: number[] | undefined, gender: string) {
        const settype = FigureAssets.figuredata.settypes.find((settype) => settype.type === part);

        if(!settype) {
            throw new Error("Set type does not exist for part.");
        }

        const palette = FigureAssets.figuredata.palettes.find((palette) => palette.id === settype.paletteId);

        const imagePromises = await Promise.allSettled(
            settype.sets.filter((set) => set.selectable && (set.gender === 'U' || (set.gender === 'M' && gender === "male") || (set.gender === 'F' && gender === "female"))).map(async (set) => {
                const figureRenderer = new Figure({
                    $type: "FigureConfigurationData",
                    gender,
                    parts: [
                        {
                            $type: "FigurePartData",
                            type: settype.type,
                            setId: set.id,
                            colors: (set.colorable)?(colors ?? palette?.colors.map((color) => color.id) ?? []):([])
                        }
                    ]
                }, 2, undefined, (part === "hd"));

                const image = new Promise<ImageBitmap>((resolve, reject) => {
                    figureRenderer.renderToCanvas(this.figureWorker, 0, true).then(({ figure }) => resolve(figure.image)).catch(reject);
                });

                return {
                    image,
                    setId: set.id,
                    colorable: set.colorable,
                    colorIndexes: Math.max(...set.parts.map((part) => part.colorIndex))
                };
            })
        );

        const items = imagePromises.filter((promise) => promise.status === "fulfilled").map((promise) => promise.value);

        const paletteColors = palette?.colors.sort((a, b) => a.index - b.index).map((color) => {
            return {
                id: color.id,
                color: color.color
            };
        }) ?? [];

        return {
            items,
            colors: paletteColors,
            mandatory: settype.mandatoryGender[gender as "male" | "female"][0]
        };
    }
}