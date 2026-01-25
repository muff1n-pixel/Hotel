import { useEffect, useRef, useState } from "react";
import OffscreenCanvasRender from "../../OffscreenCanvasRender";
import WardrobeSelectionItem from "./WardrobeSelectionItem";
import WardrobeSelectionColors from "./WardrobeSelectionColors";
import FigureWardrobe, { FigureWardrobeColor, FigureWardrobeItem } from "@Client/Figure/FigureWardrobe";
import { FigureConfiguration, FigurePartKeyAbbreviation } from "@Shared/interfaces/figure/FigureConfiguration";

export type WardrobeSelectionProps = {
    part: FigurePartKeyAbbreviation;
    figureConfiguration: FigureConfiguration;

    onFigureConfigurationChange: (figureConfiguration: FigureConfiguration) => void;
};

export default function WardrobeSelection({ part, figureConfiguration, onFigureConfigurationChange }: WardrobeSelectionProps) {
    const requestedData = useRef(false);

    const [figureDataResponse, setFigureDataResponse] = useState<{
        items: FigureWardrobeItem[],
        colors: FigureWardrobeColor[],
        mandatory: boolean
    }>();

    useEffect(() => {
        if(requestedData.current) {
            return;
        }

        requestedData.current = true;

        FigureWardrobe.getWardrobePartTypes(part, activeConfiguration?.colors ?? undefined, "male").then(async (data) => setFigureDataResponse(data));
    }, []);

    const activeConfiguration = figureConfiguration.find((configuration) => configuration.type === part);
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
                            onFigureConfigurationChange(figureConfiguration.filter((configuration) => configuration.type !== part));
                        }}>
                            <div className="sprite_dialog_remove_selection"/>
                        </WardrobeSelectionItem>
                    )}

                    {figureDataResponse?.items?.map(({ image, setId, colorable }) => (
                        <WardrobeSelectionItem key={setId} active={Boolean(activeConfiguration) && (activeConfiguration?.setId === setId)} onClick={() => {
                            onFigureConfigurationChange(
                                figureConfiguration
                                    .filter((configuration) => configuration.type !== part)
                                    .concat([
                                        {
                                            type: part,
                                            setId,
                                            colors: (colorable) ? (activeConfiguration?.colors ?? figureDataResponse.colors.map((color) => color.id) ?? []) : ([])
                                        }
                                    ])
                            );
                        }}>
                            <OffscreenCanvasRender offscreenCanvas={image}/>
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

                            onFigureConfigurationChange(
                                figureConfiguration
                                    .filter((configuration) => configuration.type !== part)
                                    .concat([ activeConfiguration ])
                            );
                        }}/>
                ))}
            </div>
        </div>
    );
}
