import FigureWardrobeDialog from "../Wardrobe/FigureWardrobeDialog";
import { useCallback, useEffect, useState } from "react";
import { webSocketClient } from "../../..";
import { useDialogs } from "../../Hooks/useDialogs";
import { FigureConfigurationData, RoomBotsData, UpdateRoomBotData, UserBotData } from "@pixel63/events";
import WardrobeAvatar from "@UserInterface/Components/Wardrobe/WardrobeAvatar";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";

export type BotWardrobeDialogProps = {
    data: UserBotData;
    hidden?: boolean;
    onClose?: () => void;
}

export default function BotWardrobeDialog(props: BotWardrobeDialogProps) {
    const dialogs = useDialogs();
    const room = useRoomInstance();

    const [figureConfiguration, setFigureConfiguration] = useState(FigureConfigurationData.create(props.data.figureConfiguration));

    useEffect(() => {
        if(!room) {
            return;
        }

        const listener = room.websocket.addProtobuffListener(RoomBotsData, {
            async handle(payload: RoomBotsData) {
                if(payload.botsRemoved?.some((removedBot) => removedBot.id === props.data.id)) {
                    dialogs.closeDialog("bot-wardrobe");
                }
            },
        });

        return () => {
            room.websocket.removeProtobuffListener(RoomBotsData, listener);
        };
    }, [props.data.id, dialogs, room]);


    useEffect(() => {
        setFigureConfiguration(FigureConfigurationData.create(props.data.figureConfiguration));
    }, [props.data.figureConfiguration]);

    const handleApply = useCallback(() => {
        if(!room) {
            return;
        }

        room.websocket.sendProtobuff(UpdateRoomBotData, UpdateRoomBotData.create({
            id: props.data.id,

            figureConfiguration
        }));

        dialogs.closeDialog("bot-wardrobe");
    }, [ props.data, figureConfiguration, room ]);

    if(!figureConfiguration) {
        return null;
    }

    return (
        <FigureWardrobeDialog title={"Bot Wardrobe"} header={props.data.name ?? "Bot"} figureConfiguration={figureConfiguration} onFigureConfigurationChange={setFigureConfiguration} {...props}>
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
