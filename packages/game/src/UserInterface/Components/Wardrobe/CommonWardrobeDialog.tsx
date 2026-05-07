import FigureWardrobeDialog from "./FigureWardrobeDialog";
import { useCallback, useState } from "react";
import { useDialogs } from "../../Hooks/useDialogs";
import { FigureConfigurationData } from "@pixel63/events";
import WardrobeAvatar from "@UserInterface/Components/Wardrobe/WardrobeAvatar";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import { useTranslation } from "react-i18next";

export type CommonWardrobeDialogProps = {
    data: {
        figureConfiguration: FigureConfigurationData;
        onApply: (figureConfiguration: FigureConfigurationData) => void;
    };
    hidden?: boolean;
    onClose?: () => void;
}

export default function CommonWardrobeDialog(props: CommonWardrobeDialogProps) {
    const [getWardrobeTranslation] = useTranslation("wardrobe");

    const dialogs = useDialogs();

    const [figureConfiguration, setFigureConfiguration] = useState(props.data.figureConfiguration);

    const handleApply = useCallback(() => {
        props.data.onApply(figureConfiguration);

        dialogs.closeDialog("wardrobe-common");
    }, [ props.data, figureConfiguration ]);

    if(!figureConfiguration) {
        return null;
    }

    return (
        <FigureWardrobeDialog title={getWardrobeTranslation("wardrobe")} header={getWardrobeTranslation("wardrobe")} figureConfiguration={figureConfiguration} onFigureConfigurationChange={setFigureConfiguration} {...props}>
            <div style={{
                flex: 1,

                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <div style={{
                    width: 130,
                    height: "100%"
                }}>
                    <WardrobeAvatar configuration={figureConfiguration}/>
                </div>

                <div style={{ width: "100%" }}>
                    <DialogButton onClick={handleApply}>{getWardrobeTranslation("save_my_looks")}</DialogButton>
                </div>
            </div>
        </FigureWardrobeDialog>
    );
}
