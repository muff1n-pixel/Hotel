import DialogButton from "../../Dialog/Button/DialogButton";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { clientInstance, webSocketClient } from "../../../..";
import RoomFurniturePlacer from "@Client/Room/RoomFurniturePlacer";
import InventoryEmptyTab from "./InventoryEmptyTab";
import { useRoomInstance } from "../../../hooks/useRoomInstance";
import { useDialogs } from "../../../hooks/useDialogs";
import DialogItem from "../../Dialog/Item/DialogItem";
import FigureImage from "../../Figure/FigureImage";
import { useUser } from "../../../hooks/useUser";
import { PlaceRoomBotData, UserBotData, UserInventoryBotsData } from "@pixel63/events";

export default function InventoryBotsTab() {
    const user = useUser();
    const { setDialogHidden } = useDialogs();
    const room = useRoomInstance();

    const [activeBot, setActiveBot] = useState<UserBotData>();
    const [bots, setBots] = useState<UserBotData[]>([]);
    const requested = useRef<boolean>(false);

    const [roomFurniturePlacer, setRoomFurniturePlacer] = useState<RoomFurniturePlacer>();
    const roomFurniturePlacerId = useRef<string>(undefined);

    useEffect(() => {
        if(requested.current) {
            return;
        }

        requested.current = true;

        webSocketClient.send("GetUserBotsEvent", null);
    }, []);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(UserInventoryBotsData, {
            async handle(payload: UserInventoryBotsData) {
                if(payload.allUserBots) {
                    setBots(payload.allUserBots);
                }
                else {
                    let mutated = [...bots];

                    if(payload.updatedUserBots) {
                        mutated = 
                            payload.updatedUserBots.concat(
                                ...mutated
                                    .filter((bot) => !payload.updatedUserBots?.some((userBot) => userBot.id === bot.id))
                            );
                    }

                    if(payload.deletedUserBots) {
                        mutated = mutated
                            .filter((bot) => !payload.deletedUserBots?.some((userBot) => userBot.id === bot.id))
                    }

                    setBots(mutated);
                }
            },
        })

        return () => {
            webSocketClient.removeProtobuffListener(UserInventoryBotsData, listener);
        };
    }, [bots]);

    useEffect(() => {
        if(!activeBot && bots.length) {
            setActiveBot(bots[0]);
        }
        else if(activeBot && !bots.some((bot) => activeBot.id === bot.id)) {
            setActiveBot(bots[0] ?? undefined);
        }
        else if(activeBot) {
            const active = bots.find((bot) => activeBot.id === bot.id);

            setActiveBot(active);
        }
    }, [activeBot, bots]);

    useEffect(() => {
        if(!roomFurniturePlacer) {
            setDialogHidden("inventory", false);
            
            return;
        }

        if(!activeBot || roomFurniturePlacerId.current !== activeBot?.id) {
            roomFurniturePlacer.destroy();

            setRoomFurniturePlacer(undefined);

            setDialogHidden("inventory", false);

            return;
        }

        setDialogHidden("inventory", true);

        roomFurniturePlacer.startPlacing((position, direction) => {
            webSocketClient.sendProtobuff(PlaceRoomBotData, PlaceRoomBotData.create({
                id: activeBot.id,

                position,
                direction
            }));
        }, () => {
            roomFurniturePlacer.destroy();

            setDialogHidden("inventory", false);

            setRoomFurniturePlacer(undefined);
        });

    }, [activeBot, roomFurniturePlacer]);

    const onPlaceInRoomClick = useCallback(() => {
        if(!activeBot?.figureConfiguration) {
            return;
        }

        if(!clientInstance.roomInstance.value?.roomRenderer) {
            return;
        }

        setRoomFurniturePlacer(RoomFurniturePlacer.fromFigureConfiguration(clientInstance.roomInstance.value, activeBot.figureConfiguration));
        roomFurniturePlacerId.current = activeBot?.id;
    }, [roomFurniturePlacer, activeBot]);

    if(!bots.length) {
        return (<InventoryEmptyTab/>);
    }

    return (
        <div style={{
            flex: "1 1 0",

            overflow: "hidden",

            display: "flex",
            flexDirection: "row"
        }}>
            <div style={{
                flex: 1,

                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                alignContent: "start",
                gap: 4,

                overflowY: "scroll"
            }}>
                {bots?.map((bot) => (
                    <DialogItem
                        key={bot.id}
                        width={44}
                        active={activeBot?.id === bot.id}
                        onClick={() => setActiveBot(bot)}>
                            <div style={{
                                width: 40,
                                height: 40
                            }}>
                                {bot.figureConfiguration && (
                                    <FigureImage headOnly direction={3} figureConfiguration={bot.figureConfiguration}/>
                                )}
                            </div>
                    </DialogItem>
                ))}
            </div>

            <div style={{
                width: 170,

                display: "flex",
                flexDirection: "column",
                gap: 10
            }}>
                {(activeBot) && (
                    <Fragment>
                        <div style={{
                            flex: 1,

                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            {(activeBot.figureConfiguration) && (
                                <FigureImage direction={4} figureConfiguration={activeBot.figureConfiguration}/>
                            )}
                        </div>

                        <div>
                            <b>{activeBot?.name}</b>
                            <p>{activeBot?.motto}</p>
                        </div>

                        <DialogButton disabled={!room || room.information?.owner?.id !== user.id} onClick={onPlaceInRoomClick}>Place in room</DialogButton>
                    </Fragment>
                )}
            </div>
        </div>
    );
}
