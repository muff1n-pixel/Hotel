import FigureRenderer, { SpriteConfiguration } from "@Client/Figure/Renderer/FigureRenderer";
import { FiguredataData } from "@Client/Interfaces/Figure/FiguredataData";
import { FigureAssets } from "src/library";

export default class FigureSpriteBuilder {
    constructor(private readonly figureRenderer: FigureRenderer) {

    }

    public getAssetForSetPart(assetId: string, assetType: string) {
        for(let index = FigureAssets.figuremap!.length - 1; index >= 0; index--) {
            if(FigureAssets.figuremap![index].id.startsWith("hh_human_50")) {
                continue;
            }

            if(FigureAssets.figuremap![index].parts.some((part) => part.id === assetId && part.type === assetType.substring(0, 2))) {
                return FigureAssets.figuremap![index];
            }
        }

        return null;
    }
    
    public getSettypeForPartAndSet(part: string) {
        return FigureAssets.figuredata!.settypes.find((settype) => settype.type === part);
    }

    public getSetFromSettype(settype: FiguredataData["settypes"][0], setId: string) {
        return settype.sets.find((set) => set.id === setId);
    }

    public getSpritesFromConfiguration() {
        const result: SpriteConfiguration[] = [];
        const hiddenPartTypes: string[] = [];

        for(const configurationPart of this.figureRenderer.configuration.parts) {
            const settypeData = this.getSettypeForPartAndSet(configurationPart.type);

            if(!settypeData) {
                //console.warn("Settype does not exist for part and set.");

                continue;
            }

            const setData = this.getSetFromSettype(settypeData, configurationPart.setId);

            if(!setData) {
                //console.warn("Set does not exist for set type.");

                continue;
            }

            if(setData.hiddenPartTypes) {
                hiddenPartTypes.push(...setData.hiddenPartTypes);
            }

            if(settypeData.type === "hd" && !setData.parts.some((part) => part.type === "sd")) {
                setData.parts.push({
                    id: "1",
                    type: "sd",
                    colorable: false,
                    index: 0,
                    colorIndex: 0
                });
            }

            for(const setPartData of setData.parts) {
                if(!setPartData) {
                    //console.error("???");

                    continue;
                }
                
                let setPartAssetData = this.getAssetForSetPart(setPartData.id, setPartData.type);

                if(!setPartAssetData) {
                    if(["ls", "rs"].includes(setPartData.type) && setPartData.id === "2") {
                        setPartAssetData = FigureAssets.figuremap!.find((asset) => asset.id === "hh_human_shirt") ?? null;
                    }

                    if(!setPartAssetData) {
                        //console.log("Set part asset data does not exist for set part id " + setPartData.id + ", type " + setPartData.type + ".");

                        continue;
                    }
                }

                result.push({
                    colorable: setPartData.colorable,
                    colors: configurationPart.colors,
                    colorIndex: setPartData.colorIndex,
                    colorPaletteId: settypeData.paletteId,
                    
                    index: setPartData.index,

                    id: setPartData.id,
                    type: setPartData.type,

                    assetId: setPartAssetData.id
                });
            }
        }

        const filteredResult = result.filter((result) => !hiddenPartTypes.includes(result.type));

        return filteredResult;
    }
}