import { useEffect, useRef, useState } from "react";
import OffscreenCanvasRender from "../../OffscreenCanvasRender";
import WardrobeSelectionItem from "./WardrobeSelectionItem";
import WardrobeSelectionColors from "./WardrobeSelectionColors";
import FigureWardrobe, { FigureWardrobeColor, FigureWardrobeItem } from "@Client/Figure/Wardrobe/FigureWardrobe";
import FurnitureAssets from "@Client/Assets/FurnitureAssets";
import { FigureConfigurationData } from "@pixel63/events";

export type WardrobeSelectionProps = {
    part: string;
    figureConfiguration: FigureConfigurationData;

    onFigureConfigurationChange: (figureConfiguration: FigureConfigurationData) => void;
};

export default function WardrobeSelection({ part, figureConfiguration, onFigureConfigurationChange }: WardrobeSelectionProps) {
    const requestedData = useRef<string>(undefined);

    const [activeConfiguration, setActiveConfiguration] = useState(figureConfiguration.parts.find((configuration) => configuration.type === part));

    const [figureDataResponse, setFigureDataResponse] = useState<{
        items: FigureWardrobeItem[],
        colors: FigureWardrobeColor[],
        mandatory: boolean
    }>();

    useEffect(() => {
        setActiveConfiguration(figureConfiguration.parts.find((configuration) => configuration.type === part));
    }, [part]);

    useEffect(() => {
        if(requestedData.current === activeConfiguration?.colors.join(',')) {
            return;
        }

        requestedData.current = activeConfiguration?.colors.join(',');

        FigureWardrobe.getWardrobePartTypes(part, activeConfiguration?.colors, figureConfiguration.gender).then(async (data) => setFigureDataResponse(data));
    }, [activeConfiguration, figureConfiguration]);

    const activeFigureData = activeConfiguration && figureDataResponse?.items.find((item) => item.setId === activeConfiguration.setId);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,

            width: 6 * 50,
        }}>
            <div style={{
                height: 4 * 50,

                overflowY: "overlay"
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                }}>
                    {(!figureDataResponse?.mandatory) && (
                        <WardrobeSelectionItem active={!activeConfiguration} onClick={() => {
                            onFigureConfigurationChange({
                                ...figureConfiguration,
                                parts: figureConfiguration.parts.filter((configuration) => configuration.type !== part)
                            });
                        }}>
                            <div className="sprite_dialog_remove_selection"/>
                        </WardrobeSelectionItem>
                    )}

                    {figureDataResponse?.items?.map(({ image, setId, colorable }) => (
                        <WardrobeSelectionItem key={setId} active={Boolean(activeConfiguration) && (activeConfiguration?.setId === setId)} onClick={() => {
                            onFigureConfigurationChange({
                                ...figureConfiguration,
                                parts:
                                    figureConfiguration.parts.filter((configuration) => configuration.type !== part)
                                    .concat([
                                        {
                                            $type: "FigurePartData",
                                            type: part,
                                            setId,
                                            colors: (colorable) ? (activeConfiguration?.colors ?? figureDataResponse.colors.map((color) => color.id) ?? []) : ([])
                                        }
                                    ])
                            });
                        }}>
                            <OffscreenCanvasRender offscreenCanvas={image} placeholderImage={FurnitureAssets.placeholder32?.image}/>
                        </WardrobeSelectionItem>
                    ))}
                </div>
            </div>

            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: 6
            }}>
                {Array(Math.max(1, activeFigureData?.colorIndexes ?? 1)).fill(null).map((_, index) => (
                    <WardrobeSelectionColors
                        key={index}
                        disabled={!activeConfiguration || !activeFigureData?.colorable}
                        colors={figureDataResponse?.colors}
                        activeColor={activeConfiguration?.colors[index]}
                        onColorChange={(color) => {
                            if(!activeConfiguration) {
                                return;
                            }

                            activeConfiguration.colors[index] = color;

                            onFigureConfigurationChange({
                                ...figureConfiguration,
                                parts:
                                    figureConfiguration.parts
                                    .filter((configuration) => configuration.type !== part)
                                    .concat([ activeConfiguration ])
                            });
                        }}/>
                ))}
            </div>
        </div>
    );
}
