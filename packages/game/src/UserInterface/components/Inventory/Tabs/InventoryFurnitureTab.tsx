import FurnitureIcon from "../../Furniture/FurnitureIcon";
import DialogButton from "../../Dialog/Button/DialogButton";
import RoomRenderer from "../../Room/Renderer/RoomRenderer";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { clientInstance, webSocketClient } from "../../../..";
import RoomFurniturePlacer from "@Client/Room/RoomFurniturePlacer";
import InventoryEmptyTab from "./InventoryEmptyTab";
import { useRoomInstance } from "../../../hooks/useRoomInstance";
import { PlaceFurnitureEventData } from "@Shared/Communications/Requests/Rooms/Furniture/PlaceFurnitureEventData";
import { PlaceRoomContentFurnitureEventData } from "@Shared/Communications/Requests/Rooms/Furniture/PlaceRoomContentFurnitureEventData";
import { useDialogs } from "../../../hooks/useDialogs";
import DialogItem from "../../Dialog/Item/DialogItem";
import { UserInventoryFurnitureCollectionData, UserInventoryFurnitureData } from "@pixel63/events";

export default function InventoryFurnitureTab() {
    const { setDialogHidden } = useDialogs();
    const room = useRoomInstance();

    const [activeFurniture, setActiveFurniture] = useState<UserInventoryFurnitureData>();
    const [userFurniture, setUserFurniture] = useState<UserInventoryFurnitureData[]>([]);
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
        const listener = webSocketClient.addProtobuffListener(UserInventoryFurnitureCollectionData, {
            async handle(payload: UserInventoryFurnitureCollectionData) {
                if(payload.allUserFurniture) {
                    setUserFurniture(payload.allUserFurniture);
                }
                else {
                    let mutatedUserFurniture = [...userFurniture];

                    if(payload.updatedUserFurniture) {
                        mutatedUserFurniture = 
                            payload.updatedUserFurniture.concat(
                                ...mutatedUserFurniture
                                    .filter((userFurniture) => !payload.updatedUserFurniture?.some((updatedUserFurniture) => (
                                        (updatedUserFurniture.furniture?.flags?.inventoryStackable)?(updatedUserFurniture.furniture?.id === userFurniture.furniture?.id):(updatedUserFurniture.id === userFurniture.id)
                                    )))
                            );
                    }

                    if(payload.deletedUserFurniture) {
                        mutatedUserFurniture = mutatedUserFurniture
                            .filter((userFurniture) => !payload.deletedUserFurniture?.some((updatedUserFurniture) => 
                                (updatedUserFurniture.furniture?.flags?.inventoryStackable)?(updatedUserFurniture.furniture?.id === userFurniture.furniture?.id):(updatedUserFurniture.id === userFurniture.id)
                            ))
                    }

                    setUserFurniture(mutatedUserFurniture);
                }
            },
        })

        return () => {
            webSocketClient.removeProtobuffListener(UserInventoryFurnitureCollectionData, listener);
        };
    }, [userFurniture]);

    useEffect(() => {
        if(!activeFurniture && userFurniture.length) {
            setActiveFurniture(userFurniture[0]);
        }
        else if(activeFurniture && !userFurniture.some((userFurniture) => (
            (activeFurniture.furniture?.flags?.inventoryStackable)?(activeFurniture.furniture?.id === userFurniture.furniture?.id):(activeFurniture.id === userFurniture.id)
        ))) {
            setActiveFurniture(userFurniture[0] ?? undefined);
        }
        else if(activeFurniture) {
            const active = userFurniture.find((userFurniture) => 
                (activeFurniture.furniture?.flags?.inventoryStackable)?(activeFurniture.furniture?.id === userFurniture.furniture?.id):(activeFurniture.id === userFurniture.id)
            );

            setActiveFurniture(active);
        }
    }, [activeFurniture, userFurniture]);

    useEffect(() => {
        if(!roomFurniturePlacer) {
            setDialogHidden("inventory", false);
            
            return;
        }

        if(!activeFurniture || roomFurniturePlacerId.current !== ((activeFurniture?.furniture?.flags?.inventoryStackable)?(activeFurniture?.furniture.id):(activeFurniture?.id))) {
            roomFurniturePlacer.destroy();

            setRoomFurniturePlacer(undefined);

            setDialogHidden("inventory", false);

            return;
        }

        setDialogHidden("inventory", true);

        roomFurniturePlacer.startPlacing((position, direction) => {
            webSocketClient.send<PlaceFurnitureEventData>("PlaceFurnitureEvent", {
                userFurnitureId: activeFurniture.id,
                furnitureId: activeFurniture.furniture!.id,
                stackable: activeFurniture.furniture!.flags!.inventoryStackable,
                
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
        if(!activeFurniture?.furniture) {
            return;
        }

        if(activeFurniture.furniture?.type === "wallpaper" || activeFurniture.furniture?.type === "floor") {
            webSocketClient.send<PlaceRoomContentFurnitureEventData>("PlaceRoomContentFurnitureEvent", {
                userFurnitureId: activeFurniture.id,
                furnitureId: activeFurniture.furniture?.id,
                stackable: activeFurniture.furniture?.flags?.inventoryStackable ?? false
            });

            return;
        }

        if(!clientInstance.roomInstance.value?.roomRenderer) {
            return;
        }

        setRoomFurniturePlacer(RoomFurniturePlacer.fromFurnitureData(clientInstance.roomInstance.value, activeFurniture.furniture));
        roomFurniturePlacerId.current = (activeFurniture?.furniture.flags?.inventoryStackable)?(activeFurniture?.furniture.id):(activeFurniture?.id);
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
                    <DialogItem
                        key={(userFurniture.furniture?.flags?.inventoryStackable)?(userFurniture.furniture?.id):(userFurniture.id)}
                        active={activeFurniture?.id === userFurniture.id}
                        onClick={() => setActiveFurniture(userFurniture)}>
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
                    </DialogItem>
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
                        <RoomRenderer key={activeFurniture.id} options={{ withoutWalls: activeFurniture.furniture?.placement === "floor" }} furnitureData={activeFurniture?.furniture} style={{
                            height: 130,
                            width: "100%",
                        }}/>

                        <div style={{ flex: 1 }}>
                            <b>{activeFurniture?.furniture?.name}</b>
                            <p>{activeFurniture?.furniture?.description}</p>
                        </div>

                        <DialogButton disabled={!room || !room.hasRights} onClick={onPlaceInRoomClick}>Place in room</DialogButton>
                    </Fragment>
                )}
            </div>
        </div>
    );
}
