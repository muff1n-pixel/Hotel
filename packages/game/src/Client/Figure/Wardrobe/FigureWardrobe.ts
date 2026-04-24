import FigureAssets from "@Client/Assets/FigureAssets";
import Figure from "../Figure";
import { FigureConfigurationData, UserClothesData, UserClothingData } from "@pixel63/events";
import { FiguredataData } from "@Client/Interfaces/Figure/FiguredataData";

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
    public static async getWardrobePartTypes(data: UserClothesData, colors: number[] | undefined, gender: string, editMode: boolean) {
        const settype = FigureAssets.figuredata.settypes.find((settype) => settype.type === data.part);

        if(!settype) {
            throw new Error("Set type does not exist for part.");
        }

        const palette = FigureAssets.figuredata.palettes.find((palette) => palette.id === settype.paletteId);

        let sets;
        
        if(!editMode) {
            sets =
                data.clothes.map((clothing) => settype.sets.find((set) => set.id === clothing.setId))
                .filter((set) => set !== undefined)
                .sort((a, b) => parseInt(a.id) - parseInt(b.id))
                .concat(
                    data.userClothes.map((clothing) => settype.sets.find((set) => set.id === clothing.setId))
                    .filter((set) => set !== undefined)
                    .sort((a, b) => parseInt(a.id) - parseInt(b.id))
                )
                .filter((set) => this.filterSetGender(set, gender));
        }
        else {
            sets = settype.sets
                .filter((set) => set.selectable && this.filterSetGender(set, gender))
                .filter((set) => set !== undefined)
                .sort((a, b) => parseInt(a.id) - parseInt(b.id));
        }

        const imagePromises = await Promise.allSettled(
            sets.map(async (set) => {
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
                }, 2, undefined, (data.part === "hd"));

                const image = new Promise<ImageBitmap>((resolve, reject) => {
                    figureRenderer.renderToCanvas(0, true).then(({ figure }) => resolve(figure.image)).catch(reject);
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

    public static addSetsToFigure(figureConfiguration: FigureConfigurationData, setIds: string[]) {
        for(const setTypes of FigureAssets.figuredata.settypes) {
            const applicableSets = setTypes.sets.filter((set) => setIds.includes(set.id) && this.filterSetGender(set, figureConfiguration.gender));

            for(const set of applicableSets) {
                const existingIndex = figureConfiguration.parts.findIndex((part) => part.type === setTypes.type);

                if(existingIndex !== -1) {
                    figureConfiguration.parts[existingIndex].setId = set.id;
                }
                else {
                    figureConfiguration.parts.push({
                        "$type": "FigurePartData",
                        type: setTypes.type,
                        setId: set.id,
                        colors: []
                    });
                }
            }
        }

        return figureConfiguration;
    }

    public static filterSetGender(set: FiguredataData["settypes"][0]["sets"][0], gender: string) {
        return (set.gender === 'U' || (set.gender === 'M' && gender === "male") || (set.gender === 'F' && gender === "female"));
    }
}