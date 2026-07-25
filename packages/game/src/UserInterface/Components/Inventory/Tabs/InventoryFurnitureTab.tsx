import FurnitureIcon from "../../Furniture/FurnitureIcon";
import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import { Fragment, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { clientInstance, webSocketClient } from "../../../..";
import RoomFurniturePlacer from "@Client/Room/RoomFurniturePlacer";
import InventoryEmptyTab from "./InventoryEmptyTab";
import { useRoomInstance } from "../../../Hooks/useRoomInstance";
import { useDialogs } from "../../../Hooks/useDialogs";
import DialogItem from "../../../Common/Dialog/Components/Item/DialogItem";
import { GetUserInventoryFurnitureData, PlaceRoomContentFurnitureData, PlaceRoomFurnitureData, RoomStructureData, UserInventoryFurnitureCollectionData, UserInventoryFurnitureData } from "@pixel63/events";
import DialogScrollArea from "../../../Common/Dialog/Components/Scroll/DialogScrollArea";
import RoomRenderer from "@UserInterface/Common/Room/RoomRenderer";
import { useTranslation } from "react-i18next";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import Input from "@UserInterface/Common/Form/Components/Input";
import Selection from "@UserInterface/Common/Form/Components/Selection";

export type InventoryFurnitureTabProps = {
    allowPlacingInRoom: boolean;
    trading?: boolean;
    button?: (activeFurniture: UserInventoryFurnitureData | undefined) => ReactNode;
};

export default function InventoryFurnitureTab({ trading, allowPlacingInRoom, button }: InventoryFurnitureTabProps) {
    const [getTranslation] = useTranslation("inventory");

    const { setDialogHidden } = useDialogs();
    const room = useRoomInstance();

    const [activeFurniture, setActiveFurniture] = useState<UserInventoryFurnitureData>();

    const [userFurniture, setUserFurniture] = useState<UserInventoryFurnitureData[]>([]);
    const userFurnitureRequested = useRef<boolean>(false);

    const [roomFurniturePlacer, setRoomFurniturePlacer] = useState<RoomFurniturePlacer>();
    const roomFurniturePlacerId = useRef<string>(undefined);

    const [search, setSearch] = useState("");
    const [type, setType] = useState<string | null>(null);
    const [location, setLocation] = useState("inventory");

    const filteredUserFurniture = useMemo(() => {
        let filteredUserFurniture = userFurniture;

        if(search) {
            const lowerCasedSearch = search.toLowerCase();

            filteredUserFurniture = filteredUserFurniture.filter((userFurniture) => userFurniture.furniture?.name?.toLowerCase().includes(lowerCasedSearch) || userFurniture.furniture?.description?.toLowerCase().includes(lowerCasedSearch));
        }

        if(type) {
            filteredUserFurniture = filteredUserFurniture.filter((userFurniture) => userFurniture.furniture?.placement === type);
        }

        return filteredUserFurniture;
    }, [userFurniture, search, type]);

    useEffect(() => {
        if(userFurnitureRequested.current) {
            return;
        }

        userFurnitureRequested.current = true;

        webSocketClient.sendProtobuff(GetUserInventoryFurnitureData, GetUserInventoryFurnitureData.create({
            trading
        }));
    }, [trading]);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(UserInventoryFurnitureCollectionData, {
            async handle(payload: UserInventoryFurnitureCollectionData) {
                if(payload.trading && !trading) {
                    return;
                }

                if(payload.allUserFurniture.length) {
                    setUserFurniture(payload.allUserFurniture);
                }
                else {
                    let mutatedUserFurniture = [...userFurniture];

                    if(payload.updatedUserFurniture.length) {
                        mutatedUserFurniture =
                            payload.updatedUserFurniture.concat(
                                ...mutatedUserFurniture
                                    .filter((userFurniture) => !payload.updatedUserFurniture?.some((updatedUserFurniture) => (
                                        (updatedUserFurniture.furniture?.flags?.inventoryStackable)?(updatedUserFurniture.furniture?.id === userFurniture.furniture?.id):(updatedUserFurniture.id === userFurniture.id)
                                    )))
                            );
                    }

                    if(payload.deletedUserFurniture.length) {
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
    }, [userFurniture, trading]);

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
            webSocketClient.sendProtobuff(PlaceRoomFurnitureData, PlaceRoomFurnitureData.create({
                id: activeFurniture.id,
                furnitureId: activeFurniture.furniture!.id,
                stackable: activeFurniture.furniture!.flags!.inventoryStackable,

                position,
                direction
            }));
        }, () => {
            roomFurniturePlacer.destroy();

            setDialogHidden("inventory", false);

            setRoomFurniturePlacer(undefined);
        });

    }, [activeFurniture, roomFurniturePlacer]);

    const onPlaceInRoomClick = useCallback((userFurniture: UserInventoryFurnitureData) => {
        if(!userFurniture?.furniture) {
            return;
        }

        if(userFurniture.furniture?.type === "wallpaper" || userFurniture.furniture?.type === "floor" || userFurniture.furniture?.type === "landscape") {
            webSocketClient.sendProtobuff(PlaceRoomContentFurnitureData, PlaceRoomContentFurnitureData.create({
                id: userFurniture.id,
                furnitureId: userFurniture.furniture?.id,
                stackable: userFurniture.furniture?.flags?.inventoryStackable ?? false
            }));

            return;
        }

        if(!clientInstance.roomInstance.value?.roomRenderer) {
            return;
        }

        setRoomFurniturePlacer(RoomFurniturePlacer.fromFurnitureData(clientInstance.roomInstance.value, userFurniture.furniture, userFurniture.userFurniture));
        roomFurniturePlacerId.current = (userFurniture?.furniture.flags?.inventoryStackable)?(userFurniture?.furniture.id):(userFurniture?.id);
    }, [roomFurniturePlacer]);

    const handleMouseDown = useCallback((userFurniture: UserInventoryFurnitureData) => {
        if(!allowPlacingInRoom) {
            return;
        }

        if(!clientInstance.roomInstance.value) {
            return;
        }

        if(roomFurniturePlacer) {
            roomFurniturePlacer.destroy();
        }

        const mousemove = () => {
            document.body.removeEventListener("mousemove", mousemove);

            if(room && userFurniture.furniture) {
                setRoomFurniturePlacer(RoomFurniturePlacer.fromFurnitureData(room, userFurniture.furniture));
                roomFurniturePlacerId.current = (userFurniture?.furniture.flags?.inventoryStackable)?(userFurniture?.furniture.id):(userFurniture?.id);
            }
        };

        document.body.addEventListener("mousemove", mousemove);

        document.body.addEventListener("mouseup", () => {
            document.body.removeEventListener("mousemove", mousemove);
        }, {
            once: true
        });
    }, [ setDialogHidden, room, activeFurniture, roomFurniturePlacer, allowPlacingInRoom ]);

    if(!userFurniture.length) {
        return (<InventoryEmptyTab/>);
    }

    return (
        <FlexLayout style={{
            flex: "1 1 0"
        }}>
            <FlexLayout direction="row" style={{
                background: "#C9C9C9",
                borderRadius: 3,
                padding: "2px 3px",
                width: "100%"
            }}>
                <Input style={{ flex: 1, width: "100%" }} value={search} onChange={setSearch}/>

                <Selection style={{ flex: 1 }} value={type} items={[
                    {
                        value: null,
                        label: "Any type"
                    },
                    {
                        value: "floor",
                        label: "Floor items"
                    },
                    {
                        value: "wall",
                        label: "Wall items"
                    }
                ]} onChange={setType}/>

                <Selection disabled style={{ flex: 1 }} value={location} items={[
                    {
                        value: "inventory",
                        label: "In inventory"
                    },
                    {
                        value: "rooms",
                        label: "In rooms"
                    }
                ]} onChange={setLocation}/>
            </FlexLayout>

            <div style={{
                flex: "1 1 0",

                overflow: "hidden",

                display: "flex",
                flexDirection: "row",

                gap: 10
            }}>
                <DialogScrollArea style={{ gap: 1 }} hideInactive>
                    <div style={{
                        flex: 1,

                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignContent: "start",
                        gap: 4
                    }}>
                        {filteredUserFurniture.map((userFurniture) => (
                            <DialogItem
                                key={(userFurniture.furniture?.flags?.inventoryStackable)?(userFurniture.furniture?.id):(userFurniture.id)}
                                active={activeFurniture?.id === userFurniture.id}
                                onClick={() => setActiveFurniture(userFurniture)}
                                onMouseDown={() => room && room.hasRights && handleMouseDown(userFurniture)}>
                                    <FurnitureIcon furnitureData={userFurniture.furniture} colorTags={userFurniture.userFurniture?.colorTags}/>

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
                </DialogScrollArea>
                    
                <div style={{
                    width: 170,

                    display: "flex",
                    flexDirection: "column",
                    gap: 10
                }}>
                    {(activeFurniture) && (
                        <Fragment>
                            <div style={{
                                height: 130
                            }}>
                                <RoomRenderer
                                    structure={RoomStructureData.create({
                                        grid: new Array(7).fill(null).map((_) => new Array(7).fill(null).map(() => '0').join('')),
                                        floor: {
                                            id: clientInstance.roomInstance.value?.roomRenderer.structure.data.floor?.id ?? "111",
                                            thickness: 8
                                        },
                                        wall: {
                                            id: clientInstance.roomInstance.value?.roomRenderer.structure.data.wall?.id ?? "201",
                                            thickness: 8,
                                            hidden: false
                                        },
                                        landscape: {
                                            id: clientInstance.roomInstance.value?.roomRenderer.structure.data.landscape?.id ?? "default",
                                        }
                                    })}
                                    furniture={
                                        (activeFurniture?.furniture)?([
                                            {
                                                id: activeFurniture.id,
                                                furniture: activeFurniture.furniture,
                                                externalImage: activeFurniture.userFurniture?.data?.externalImage?.externalImage,
                                                figureConfiguration: activeFurniture.userFurniture?.data?.mannequin?.figureConfiguration,
                                                panToItem: true,
                                                colorTags: activeFurniture.userFurniture?.colorTags
                                            }
                                        ]):([])
                                    }
                                    />
                            </div>

                            <div style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
                                <b>{activeFurniture.name ?? activeFurniture?.furniture?.name}</b>
                                <p style={{ textOverflow: "ellipsis", maxHeight: 40, overflow: "hidden" }}>{activeFurniture.description ?? activeFurniture?.furniture?.description}</p>
                            </div>

                            {(allowPlacingInRoom)?(
                                <DialogButton disabled={!room || !room.hasRights} onClick={() => activeFurniture && onPlaceInRoomClick(activeFurniture)}>{getTranslation("place_in_room")}</DialogButton>
                            ):(
                                button?.(activeFurniture)
                            )}
                        </Fragment>
                    )}
                </div>
            </div>
        </FlexLayout>
    );
}