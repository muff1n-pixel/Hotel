import RoomFigureItem from "@Client/Room/Items/Figure/RoomFigureItem";
import RoomItemContextMenuWrapper from "../RoomItemContextMenuWrapper";
import UserContextMenuElement from "../../../Users/UserContextMenuElement";
import { Fragment, useEffect, useState } from "react";
import { useRoomInstance } from "../../../../../hooks/useRoomInstance";
import { useUser } from "../../../../../hooks/useUser";
import UserContextMenuButton from "../../../Users/UserContextMenuButton";
import { useDialogs } from "../../../../../hooks/useDialogs";
import { webSocketClient } from "../../../../../..";
import { PickupRoomBotData, UpdateRoomBotData } from "@pixel63/events";

export type RoomBotContextMenuProps = {
    item: RoomFigureItem;
};

export default function RoomBotContextMenu({ item }: RoomBotContextMenuProps) {
    const dialogs = useDialogs();
    const room = useRoomInstance();
    const user = useUser();

    const [bot, setBot] = useState(room?.getBotByItem(item));

    useEffect(() => {
        setBot(room?.getBotByItem(item));
    }, [room, item]);

    if(!bot) {
        return null;
    }
    
    return (
        <RoomItemContextMenuWrapper item={item}>
            <UserContextMenuElement position="top">
                {bot.data.name}
            </UserContextMenuElement>

            {(bot.data.userId === user.id) && (
                <Fragment>
                    <UserContextMenuButton text={"Wardrobe"} onClick={() => {
                        dialogs.addUniqueDialog("bot-wardrobe", bot.data);
                    }}/>

                    <UserContextMenuButton text={(bot.data.relaxed)?("Stiffen"):("Relax")} onClick={() => {
                        webSocketClient.sendProtobuff(UpdateRoomBotData, UpdateRoomBotData.create({
                            id: bot.data.id,

                            relaxed: !bot.data.relaxed
                        }));
                    }}/>

                    <UserContextMenuButton text={"Setup speech"} onClick={() => {
                        dialogs.addUniqueDialog("bot-speech", bot.data);
                    }}/>

                    <UserContextMenuButton text={"Pick up"} onClick={() => {
                        webSocketClient.sendProtobuff(PickupRoomBotData, PickupRoomBotData.create({
                            id: bot.data.id
                        }));
                    }}/>
                </Fragment>
            )}
        </RoomItemContextMenuWrapper>
    );
}
