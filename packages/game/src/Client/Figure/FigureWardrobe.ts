import FigureAssets from "@Client/Assets/FigureAssets";
import FigureWorker from "./Worker/FigureWorker";
import FigureRenderer from "./FigureRenderer";
import { FigurePartKeyAbbreviation } from "@Shared/interfaces/figure/FigureConfiguration";

export type FigureWardrobeItem = {
    image: Promise<ImageBitmap>;
    setId: string;
    colorable: boolean;
};

export type FigureWardrobeColor = {
    id: number;
    color?: string;
};

export default class FigureWardrobe {
    public static figureWorker = new FigureWorker(true);

    public static async getWardrobePartTypes(part: FigurePartKeyAbbreviation, colorId: number | undefined, gender: "male" | "female") {
        const settype = FigureAssets.figuredata.settypes.find((settype) => settype.type === part);

        if(!settype) {
            throw new Error("Set type does not exist for part.");
        }

        const palette = FigureAssets.figuredata.palettes.find((palette) => palette.id === settype.paletteId);

        const imagePromises = await Promise.allSettled(
            settype.sets.filter((set) => set.selectable && (set.gender === 'U' || (set.gender === 'M' && gender === "male") || (set.gender === 'F' && gender === "female"))).map(async (set) => {
                const figureRenderer = new FigureRenderer([
                    {
                        type: settype.type,
                        setId: set.id,
                        colorIndex: (set.colorable)?(colorId ?? palette?.colors[0].id):(undefined)
                    }
                ], 2);

                const image = new Promise<ImageBitmap>((resolve, reject) => {
                    figureRenderer.renderToCanvas(this.figureWorker, 0, true).then(({ image }) => resolve(image)).catch(reject);
                });

                return {
                    image,
                    setId: set.id,
                    colorable: set.colorable,
                };
            })
        );

        const items = imagePromises.filter((promise) => promise.status === "fulfilled").map((promise) => promise.value);

        const colors = palette?.colors.sort((a, b) => a.index - b.index).map((color) => {
            return {
                id: color.id,
                color: color.color
            };
        }) ?? [];

        return {
            items,
            colors,
            mandatory: settype.mandatoryGender[gender][0]
        };
    }
}