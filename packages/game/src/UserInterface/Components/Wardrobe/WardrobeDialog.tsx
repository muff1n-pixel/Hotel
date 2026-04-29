import { useUser } from "../../Hooks2/useUser";
import FigureWardrobeDialog from "./FigureWardrobeDialog";
import { webSocketClient } from "../../..";
import { useCallback, useState } from "react";
import { FigureConfigurationData, SetUserFigureConfigurationData } from "@pixel63/events";
import WardrobeAvatar from "@UserInterface/Components/Wardrobe/WardrobeAvatar";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";

export type WardrobeDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
};

export default function WardrobeDialog(props: WardrobeDialogProps) {
    const user = useUser();

    const [figureConfiguration, setFigureConfiguration] = useState<FigureConfigurationData | undefined>(user.figureConfiguration);
    
    const handleApply = useCallback(() => {
        webSocketClient.sendProtobuff(SetUserFigureConfigurationData, SetUserFigureConfigurationData.create({
            figureConfiguration
        }));
    }, [figureConfiguration]);

    if(!figureConfiguration) {
        return null;
    }

    return (
        <FigureWardrobeDialog title="Wardrobe" header={user.name} figureConfiguration={figureConfiguration} onFigureConfigurationChange={setFigureConfiguration} {...props}>
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
                    <DialogButton onClick={handleApply}>Save my looks</DialogButton>
                </div>
            </div>
        </FigureWardrobeDialog>
    );
}
