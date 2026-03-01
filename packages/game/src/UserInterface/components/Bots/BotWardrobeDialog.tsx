import FigureWardrobeDialog from "../Wardrobe/FigureWardrobeDialog";
import { UserBotData } from "@Shared/Interfaces/Room/RoomBotData";
import { useCallback } from "react";
import { webSocketClient } from "../../..";
import { useDialogs } from "../../hooks/useDialogs";
import { FigureConfigurationData, UpdateRoomBotData } from "@pixel63/events";

export type BotWardrobeDialogProps = {
    data: UserBotData;
    hidden?: boolean;
    onClose?: () => void;
}

export default function BotWardrobeDialog(props: BotWardrobeDialogProps) {
    const dialogs = useDialogs();

    const handleApply = useCallback((figureConfiguration: FigureConfigurationData) => {
        webSocketClient.sendProtobuff(UpdateRoomBotData, UpdateRoomBotData.create({
            id: props.data.id,

            figureConfiguration
        }));

        dialogs.closeDialog("bot-wardrobe");
    }, [ props.data ]);

    return (
        <FigureWardrobeDialog title={"Bot Wardrobe"} header={props.data.name ?? "Bot"} initialFigureConfiguration={props.data.figureConfiguration} onApply={handleApply} {...props}/>
    );
}
