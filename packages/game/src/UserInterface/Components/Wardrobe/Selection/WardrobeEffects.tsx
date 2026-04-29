import { useCallback } from "react";
import WardrobeSelectionItem from "./WardrobeSelectionItem";
import { FigureConfigurationData } from "@pixel63/events";
import DialogScrollArea from "../../../Common/Dialog/Components/Scroll/DialogScrollArea";
import { useDialogs } from "@UserInterface/Hooks2/useDialogs";
import useEffects from "@UserInterface/Components/Wardrobe/Hooks/useEffects";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";

export type WardrobeEffectsProps = {
    figureConfiguration: FigureConfigurationData;

    onFigureConfigurationChange: (figureConfiguration: FigureConfigurationData) => void;
    editMode: boolean;
};

export default function WardrobeEffects({ figureConfiguration, onFigureConfigurationChange, editMode }: WardrobeEffectsProps) {
    const dialogs = useDialogs();

    const effects = useEffects();

    const handleEquip = useCallback((effect: number) => {
        if(editMode) {
            return;
        }

        onFigureConfigurationChange({
            ...figureConfiguration,
            effect
        });
    }, [editMode]);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,

            width: (6 * 50) + 20,
        }}>
            <FlexLayout direction="row" align="center">
                <div className="sprite_wardrobe_effects_fx"/>

                <h2>Avatar effects</h2>
            </FlexLayout>

            {(!effects.length)?(
                <FlexLayout direction="column" flex={1} style={{
                    padding: 5
                }}>
                    <h3>No content!</h3>

                    <p>Sorry! You do not own any effects!</p>
                </FlexLayout>
            ):(
                <DialogScrollArea hideInactive style={{
                    flex: "unset",
                    height: 4 * 50,
                    overflow: "hidden"
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                    }}>
                        <WardrobeSelectionItem active={!figureConfiguration.effect} onClick={() => {
                            if(editMode) {
                                return;
                            }

                            onFigureConfigurationChange({
                                ...figureConfiguration,
                                effect: undefined
                            });
                        }}>
                            <div className="sprite_dialog_remove_selection"/>
                        </WardrobeSelectionItem>

                        {effects.map((effect) => (
                            <WardrobeSelectionItem key={effect} active={figureConfiguration.effect === effect} onClick={() => handleEquip(effect)}>
                                <img src={`/assets/figure/effect_icons/icon_${effect}.png`}/>
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
            )}
        </div>
    );
}
