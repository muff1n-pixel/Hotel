import FurnitureIcon from "../../Furniture/FurnitureIcon";
import DialogButton from "../../Dialog/Button/DialogButton";
import RoomRenderer from "../../Room/Renderer/RoomRenderer";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { UserFurnitureData } from "@Shared/Interfaces/User/UserFurnitureData";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import { clientInstance, webSocketClient } from "../../../..";
import RoomFurniturePlacer from "@Client/Room/RoomFurniturePlacer";
import InventoryEmptyTab from "./InventoryEmptyTab";
import { useRoomInstance } from "../../../hooks/useRoomInstance";
import { UserFurnitureEventData } from "@Shared/Communications/Responses/Inventory/UserFurnitureEventData";
import { PlaceFurnitureEventData } from "@Shared/Communications/Requests/Rooms/Furniture/PlaceFurnitureEventData";
import { PlaceRoomContentFurnitureEventData } from "@Shared/Communications/Requests/Rooms/Furniture/PlaceRoomContentFurnitureEventData";
import { useDialogs } from "../../../hooks/useDialogs";

export default function InventoryFurnitureTab() {
    const { setDialogHidden } = useDialogs();
    const room = useRoomInstance();

    const [activeFurniture, setActiveFurniture] = useState<UserFurnitureData>();
    const [userFurniture, setUserFurniture] = useState<UserFurnitureData[]>([]);
    const userFurnitureRequested = useRef<boolean>(false);

    const [roomFurniturePlacer, setRoomFurniturePlacer] = useState<RoomFurniturePlacer>();
    const roomFurniturePlacerId = useRef<string>(undefined);

    useEffect(() => {
        if(userFurnitureRequested.current) {
            return;
        }

        userFurnitureRequested.current = true;

        webSocketClient.send("GetUserFurnitureEvent", null);
    }, []);

    useEffect(() => {
        const listener = (event: WebSocketEvent<UserFurnitureEventData>) => {
            if(event.data.allUserFurniture) {
                setUserFurniture(event.data.allUserFurniture);
            }
            else {
                let mutatedUserFurniture = [...userFurniture];

                if(event.data.updatedUserFurniture) {
                    mutatedUserFurniture = 
                        event.data.updatedUserFurniture.concat(
                            ...mutatedUserFurniture
                                .filter((userFurniture) => !event.data.updatedUserFurniture?.some((updatedUserFurniture) => (
                                    (updatedUserFurniture.furniture.flags.inventoryStackable)?(updatedUserFurniture.furniture.id === userFurniture.furniture.id):(updatedUserFurniture.id === userFurniture.id)
                                )))
                        );
                }

                if(event.data.deletedUserFurniture) {
                    mutatedUserFurniture = mutatedUserFurniture
                        .filter((userFurniture) => !event.data.deletedUserFurniture?.some((updatedUserFurniture) => 
                            (updatedUserFurniture.furniture.flags.inventoryStackable)?(updatedUserFurniture.furniture.id === userFurniture.furniture.id):(updatedUserFurniture.id === userFurniture.id)
                        ))
                }

                setUserFurniture(mutatedUserFurniture);
            }
        }

        webSocketClient.addEventListener<WebSocketEvent<UserFurnitureEventData>>("UserFurnitureEvent", listener);

        return () => {
            webSocketClient.removeEventListener<WebSocketEvent<UserFurnitureEventData>>("UserFurnitureEvent", listener);
        };
    }, [userFurniture]);

    useEffect(() => {
        if(!activeFurniture && userFurniture.length) {
            setActiveFurniture(userFurniture[0]);
        }
        else if(activeFurniture && !userFurniture.some((userFurniture) => (
            (activeFurniture.furniture.flags.inventoryStackable)?(activeFurniture.furniture.id === userFurniture.furniture.id):(activeFurniture.id === userFurniture.id)
        ))) {
            setActiveFurniture(userFurniture[0] ?? undefined);
        }
        else if(activeFurniture) {
            const active = userFurniture.find((userFurniture) => 
                (activeFurniture.furniture.flags.inventoryStackable)?(activeFurniture.furniture.id === userFurniture.furniture.id):(activeFurniture.id === userFurniture.id)
            );

            setActiveFurniture(active);
        }
    }, [activeFurniture, userFurniture]);

    useEffect(() => {
        if(!roomFurniturePlacer) {
            setDialogHidden("inventory", false);
            
            return;
        }

        if(!activeFurniture || roomFurniturePlacerId.current !== ((activeFurniture?.furniture.flags.inventoryStackable)?(activeFurniture?.furniture.id):(activeFurniture?.id))) {
            roomFurniturePlacer.destroy();

            setRoomFurniturePlacer(undefined);

            setDialogHidden("inventory", false);

            return;
        }

        setDialogHidden("inventory", true);

        roomFurniturePlacer.startPlacing((position, direction) => {
            console.log({ position, direction });
            
            webSocketClient.send<PlaceFurnitureEventData>("PlaceFurnitureEvent", {
                userFurnitureId: activeFurniture.id,
                furnitureId: activeFurniture.furniture.id,
                stackable: activeFurniture.furniture.flags.inventoryStackable,
                
                position,
                direction
            });
        }, () => {
            roomFurniturePlacer.destroy();

            setDialogHidden("inventory", false);

            setRoomFurniturePlacer(undefined);
        });

    }, [activeFurniture, roomFurniturePlacer]);

    const onPlaceInRoomClick = useCallback(() => {
        if(!activeFurniture) {
            return;
        }

        if(activeFurniture.furniture.type === "wallpaper" || activeFurniture.furniture.type === "floor") {
            webSocketClient.send<PlaceRoomContentFurnitureEventData>("PlaceRoomContentFurnitureEvent", {
                userFurnitureId: activeFurniture.id,
                furnitureId: activeFurniture.furniture.id,
                stackable: activeFurniture.furniture.flags.inventoryStackable
            });

            return;
        }

        if(!clientInstance.roomInstance.value?.roomRenderer) {
            return;
        }

        setRoomFurniturePlacer(RoomFurniturePlacer.fromFurnitureData(clientInstance.roomInstance.value, activeFurniture.furniture));
        roomFurniturePlacerId.current = (activeFurniture?.furniture.flags.inventoryStackable)?(activeFurniture?.furniture.id):(activeFurniture?.id);
    }, [roomFurniturePlacer, activeFurniture]);

    if(!userFurniture.length) {
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
                {userFurniture?.map((userFurniture) => (
                    <div key={(userFurniture.furniture.flags.inventoryStackable)?(userFurniture.furniture.id):(userFurniture.id)} style={{
                        display: "flex",

                        width: 40,
                        height: 40,

                        boxSizing: "border-box",

                        border: "1px solid black",
                        borderRadius: 6,

                        cursor: "pointer",

                        position: "relative"
                    }} onClick={() => setActiveFurniture(userFurniture)}>
                        <div style={{
                            flex: 1,

                            border: (activeFurniture?.id === userFurniture.id)?("2px solid white"):("none"),
                            borderRadius: 6,

                            background: "#CBCBCB",

                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <FurnitureIcon furnitureData={userFurniture.furniture}/>

                            {(userFurniture.quantity > 1) && (
                                <div style={{
                                    position: "absolute",

                                    right: 2,
                                    top: 2,

                                    border: "1px solid #2F6982",
                                    background: "#FFF",
                                    color: "#306A83",

                                    fontSize: 10,

                                    padding: "0px 2px"
                                }}>
                                    {userFurniture.quantity}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                width: 170,

                display: "flex",
                flexDirection: "column",
                gap: 10
            }}>
                {(activeFurniture) && (
                    <Fragment>
                        <RoomRenderer key={activeFurniture.id} options={{ withoutWalls: activeFurniture.furniture.placement === "floor" }} furnitureData={activeFurniture?.furniture} style={{
                            height: 130,
                            width: "100%",
                        }}/>

                        <div style={{ flex: 1 }}>
                            <b>{activeFurniture?.furniture.name}</b>
                            <p>{activeFurniture?.furniture.description}</p>
                        </div>

                        <DialogButton disabled={!room || !room.hasRights} onClick={onPlaceInRoomClick}>Place in room</DialogButton>
                    </Fragment>
                )}
            </div>
        </div>
    );
}
