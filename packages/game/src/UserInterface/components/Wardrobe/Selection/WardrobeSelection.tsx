import { useEffect, useRef, useState } from "react";
import OffscreenCanvasRender from "../../../Common/OffscreenCanvas/OffscreenCanvasRender";
import WardrobeSelectionItem from "./WardrobeSelectionItem";
import WardrobeSelectionColors from "./WardrobeSelectionColors";
import FigureWardrobe, { FigureWardrobeColor, FigureWardrobeItem } from "@Client/Figure/Wardrobe/FigureWardrobe";
import FurnitureAssets from "@Client/Assets/FurnitureAssets";
import { FigureConfigurationData, UpdateClothingData } from "@pixel63/events";
import DialogScrollArea from "../../../Common/Dialog/Components/Scroll/DialogScrollArea";
import useClothes from "@UserInterface/Components/Wardrobe/Hooks/useClothes";
import { webSocketClient } from "src";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";

export type WardrobeSelectionProps = {
    part: string;
    figureConfiguration: FigureConfigurationData;

    onFigureConfigurationChange: (figureConfiguration: FigureConfigurationData) => void;
    editMode: boolean;
};

export default function WardrobeSelection({ part, figureConfiguration, onFigureConfigurationChange, editMode }: WardrobeSelectionProps) {
    const dialogs = useDialogs();
    const data = useClothes(part);

    const requestedEditMode = useRef<boolean>(undefined);
    const requestedGender = useRef<string>(undefined);
    const requestedPart = useRef<string>(undefined);
    const requestedColors = useRef<string>(undefined);

    const [activeConfiguration, setActiveConfiguration] = useState(figureConfiguration.parts.find((configuration) => configuration.type === part));

    const [figureDataResponse, setFigureDataResponse] = useState<{
        items: FigureWardrobeItem[],
        colors: FigureWardrobeColor[],
        mandatory: boolean
    }>();

    useEffect(() => {
        setActiveConfiguration(figureConfiguration.parts.find((configuration) => configuration.type === part));
    }, [part, figureConfiguration]);

    useEffect(() => {
        if(!data) {
            return;
        }

        FigureWardrobe.getWardrobePartTypes(data, activeConfiguration?.colors, figureConfiguration.gender, editMode).then(async (data) => setFigureDataResponse(data));
    }, [activeConfiguration, figureConfiguration.gender, data, editMode]);

    const activeFigureData = activeConfiguration && figureDataResponse?.items.find((item) => item.setId === activeConfiguration.setId);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,

            width: (6 * 50) + 20,
        }}>
            <DialogScrollArea style={{
                flex: "unset",
                height: 4 * 50,
                overflow: "hidden"
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                }}>
                    {(figureDataResponse && !figureDataResponse.mandatory) && (
                        <WardrobeSelectionItem active={!activeConfiguration} onClick={() => {
                            if(editMode) {
                                return;
                            }

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
                            if(editMode) {
                                return;
                            }

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
                        }} style={{
                            position: "relative",

                        }}>
                            <OffscreenCanvasRender offscreenCanvas={image} placeholderImage={FurnitureAssets.placeholder32?.image} style={{
                                opacity: (editMode)?(
                                    (data?.clothes.some((clothing) => clothing.setId === setId))?(
                                        1
                                    ):(
                                        0.5
                                    )
                                ):(
                                    1
                                )
                            }}/>

                            {(editMode) && (
                                <div style={{
                                    fontSize: 10,
                                    position: "absolute",

                                    textAlign: "center",

                                    left: 0,
                                    right: 0,

                                    bottom: 0,

                                    background: "white",
                                    
                                    zIndex: 1
                                }}>
                                    {part}-{setId}
                                </div>
                            )}

                            {(editMode && data?.clothes.some((clothing) => clothing.setId === setId)) && (
                                <div className="sprite_sub" style={{
                                    position: "absolute",

                                    top: 0,
                                    right: 0
                                }} onClick={() => {
                                    webSocketClient.sendProtobuff(UpdateClothingData, UpdateClothingData.create({
                                        part,
                                        setId,
                                        available: false
                                    }))
                                }}/>
                            )}

                            {(editMode && !data?.clothes.some((clothing) => clothing.setId === setId)) && (
                                <div className="sprite_add" style={{
                                    position: "absolute",

                                    top: 0,
                                    right: 0,

                                    cursor: "pointer"
                                }} onClick={() => {
                                    webSocketClient.sendProtobuff(UpdateClothingData, UpdateClothingData.create({
                                        part,
                                        setId,
                                        available: true
                                    }))
                                }}/>
                            )}

                            {(editMode) && (
                                <div className="sprite_search" style={{
                                    position: "absolute",

                                    bottom: 10,
                                    right: 1,

                                    cursor: "pointer"
                                }} onClick={() => {
                                    dialogs.openUniqueDialog("furniture-browser", {
                                        searchCustomParams: setId
                                    });
                                }}/>
                            )}
                        </WardrobeSelectionItem>
                    ))}

                    <WardrobeSelectionItem active={false} onClick={() => {
                        dialogs.openUniqueDialog("shop", {
                            requestedCategory: "clothing"
                        })
                    }}>
                        <div className="sprite_add"/>
                    </WardrobeSelectionItem>
                </div>
            </DialogScrollArea>

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
