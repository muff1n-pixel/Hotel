import { Fragment, useCallback, useMemo } from "react";
import OffscreenCanvasRender from "../../../Common/OffscreenCanvas/OffscreenCanvasRender";
import WardrobeSelectionItem from "./WardrobeSelectionItem";
import WardrobeSelectionColors from "./WardrobeSelectionColors";
import FurnitureAssets from "@Client/Assets/FurnitureAssets";
import { FigureConfigurationData, UpdateClothingData } from "@pixel63/events";
import DialogScrollArea from "../../../Common/Dialog/Components/Scroll/DialogScrollArea";
import useClothes from "@UserInterface/Components/Wardrobe/Hooks/useClothes";
import { webSocketClient } from "@Game/index";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { FiguredataData } from "@Client/Interfaces/Figure/FiguredataData";
import FigureImage from "@UserInterface/Common/Figure/FigureImage";

export type WardrobeSelectionProps = {
    part: string;
    figureConfiguration: FigureConfigurationData;

    onFigureConfigurationChange: (figureConfiguration: FigureConfigurationData) => void;
    editMode: boolean;
};

export default function WardrobeSelection({ part, figureConfiguration, onFigureConfigurationChange, editMode }: WardrobeSelectionProps) {
    const dialogs = useDialogs();

    const { sets, userSets, allSets, colors, mandatory } = useClothes(part, figureConfiguration.gender);

    const activeConfiguration = useMemo(() => figureConfiguration.parts.find((configuration) => configuration.type === part), [figureConfiguration.parts]);
    const activeFigureData = useMemo(() => allSets.find((set) => set.id === activeConfiguration?.setId), [activeConfiguration]);

    const handleEquip = useCallback((set: FiguredataData["settypes"][0]["sets"][0]) => {
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
                        setId: set.id,
                        colors: (set.colorable) ? (activeConfiguration?.colors ?? colors.map((color) => color.id) ?? []) : ([])
                    }
                ])
        });
    }, [editMode, activeConfiguration, colors]);

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
                    {(!mandatory) && (
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

                    {(!editMode)?(
                        <Fragment>
                            {sets.map((set) => (
                                <WardrobeSelectionItem key={set.id} active={activeConfiguration?.setId === set.id} onClick={() => handleEquip(set)}>
                                    <FigureImage figureConfiguration={FigureConfigurationData.create({
                                        gender: figureConfiguration.gender,
                                        parts: [
                                            {
                                                type: part,
                                                setId: set.id,
                                                colors: activeConfiguration?.colors,
                                            }
                                        ]
                                    })} direction={2} cropped headOnly={part === 'hd'}/>
                                </WardrobeSelectionItem>
                            ))}

                            {userSets.map((set) => (
                                <WardrobeSelectionItem key={set.id} active={activeConfiguration?.setId === set.id} onClick={() => handleEquip(set)}>
                                    <FigureImage figureConfiguration={FigureConfigurationData.create({
                                        gender: figureConfiguration.gender,
                                        parts: [
                                            {
                                                type: part,
                                                setId: set.id,
                                                colors: activeConfiguration?.colors,
                                            }
                                        ]
                                    })} direction={2} cropped headOnly={part === 'hd'}/>

                                    {(!editMode) && (
                                        <div className="sprite_wardrobe_hangar" style={{
                                            position: "absolute",

                                            top: 0,
                                            left: 0
                                        }}/>
                                    )}
                                </WardrobeSelectionItem>
                            ))}
                        </Fragment>
                    ):(
                        allSets.map((set) => (
                            <WardrobeSelectionItem key={set.id}>
                                <FigureImage figureConfiguration={FigureConfigurationData.create({
                                    gender: figureConfiguration.gender,
                                    parts: [
                                        {
                                            type: part,
                                            setId: set.id,
                                            colors: activeConfiguration?.colors,
                                        }
                                    ]
                                })} direction={2} cropped headOnly={part === 'hd'} style={{
                                    opacity: (sets.includes(set))?(1):(0.5)
                                }}/>

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
                                    {part}-{set.id}
                                </div>

                                {(sets.includes(set))?(
                                    <div className="sprite_sub" style={{
                                        position: "absolute",

                                        top: 0,
                                        right: 0
                                    }} onClick={() => {
                                        webSocketClient.sendProtobuff(UpdateClothingData, UpdateClothingData.create({
                                            part,
                                            setId: set.id,
                                            available: false
                                        }))
                                    }}/>
                                ):(
                                    <div className="sprite_add" style={{
                                        position: "absolute",

                                        top: 0,
                                        right: 0,

                                        cursor: "pointer"
                                    }} onClick={() => {
                                        webSocketClient.sendProtobuff(UpdateClothingData, UpdateClothingData.create({
                                            part,
                                            setId: set.id,
                                            available: true
                                        }))
                                    }}/>
                                )}

                                <div className="sprite_search" style={{
                                    position: "absolute",

                                    bottom: 10,
                                    right: 1,

                                    cursor: "pointer"
                                }} onClick={() => {
                                    dialogs.openUniqueDialog("furniture-browser", {
                                        searchCustomParams: set.id
                                    });
                                }}/>
                            </WardrobeSelectionItem>
                        ))
                    )}


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
                {Array(Math.max(...(activeFigureData?.parts.map((part) => part.colorIndex)) ?? [], 1)).fill(null).map((_, index) => (
                    <WardrobeSelectionColors
                        key={index}
                        disabled={!activeConfiguration || !activeFigureData?.colorable}
                        colors={colors}
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
