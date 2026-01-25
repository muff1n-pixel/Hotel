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

        FigureWardrobe.getWardrobePartTypes(part, activeConfiguration?.colorIndex ?? undefined, "male").then(async (data) => setFigureDataResponse(data));
    }, []);

    const activeConfiguration = figureConfiguration.find((configuration) => configuration.type === part);

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
                                            colorIndex: (colorable) ? (activeConfiguration?.colorIndex ?? figureDataResponse.colors[0].id) : (undefined)
                                        }
                                    ])
                            );
                        }}>
                            <OffscreenCanvasRender offscreenCanvas={image}/>
                        </WardrobeSelectionItem>
                    ))}
                </div>
            </div>

            <WardrobeSelectionColors
                disabled={!activeConfiguration || !figureDataResponse?.items.find((item) => item.setId === activeConfiguration.setId)?.colorable}
                colors={figureDataResponse?.colors}
                activeColor={activeConfiguration?.colorIndex}
                onColorChange={(color) => {
                    if(!activeConfiguration) {
                        return;
                    }

                    onFigureConfigurationChange(
                        figureConfiguration
                            .filter((configuration) => configuration.type !== part)
                            .concat([
                                {
                                    type: part,
                                    setId: activeConfiguration.setId,
                                    colorIndex: color
                                }
                            ])
                    );
                }}/>
        </div>
    );
}
