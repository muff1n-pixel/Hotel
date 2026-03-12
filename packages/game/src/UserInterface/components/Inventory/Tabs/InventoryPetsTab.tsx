import DialogButton from "../../Dialog/Button/DialogButton";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { clientInstance, webSocketClient } from "../../../..";
import RoomFurniturePlacer from "@Client/Room/RoomFurniturePlacer";
import InventoryEmptyTab from "./InventoryEmptyTab";
import { useRoomInstance } from "../../../hooks/useRoomInstance";
import { useDialogs } from "../../../hooks/useDialogs";
import DialogItem from "../../Dialog/Item/DialogItem";
import { GetUserInventoryPetsData, PlaceRoomPetData, UserInventoryPetsData, UserPetData } from "@pixel63/events";
import DialogScrollArea from "../../Dialog/Scroll/DialogScrollArea";
import PetImage from "../../Pets/PetImage";
import { useUser } from "../../../hooks/useUser";

export default function InventoryPetsTab() {
    const user = useUser();
    const { setDialogHidden } = useDialogs();
    const room = useRoomInstance();

    const [activePet, setActivePet] = useState<UserPetData>();
    const [userPets, setUserPets] = useState<UserPetData[]>([]);
    const userPetsRequested = useRef<boolean>(false);

    const [roomFurniturePlacer, setRoomFurniturePlacer] = useState<RoomFurniturePlacer>();
    const roomFurniturePlacerId = useRef<string>(undefined);

    useEffect(() => {
        if(userPetsRequested.current) {
            return;
        }

        userPetsRequested.current = true;

        webSocketClient.sendProtobuff(GetUserInventoryPetsData, GetUserInventoryPetsData.create({}));
    }, []);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(UserInventoryPetsData, {
            async handle(payload: UserInventoryPetsData) {
                if(payload.allUserPets.length) {
                    setUserPets(payload.allUserPets);
                }
                else {
                    let mutatedUserPets = [...userPets];

                    if(payload.updatedUserPets.length) {
                        mutatedUserPets = 
                            payload.updatedUserPets.concat(
                                ...mutatedUserPets
                                    .filter((userFurniture) => !payload.updatedUserPets?.some((updatedUserPets) => updatedUserPets.id === userFurniture.id)));
                    }

                    if(payload.deletedUserPets.length) {
                        mutatedUserPets = mutatedUserPets
                            .filter((userFurniture) => !payload.deletedUserPets?.some((deletedUserPet) => deletedUserPet.id === userFurniture.id))
                    }

                    setUserPets(mutatedUserPets);
                }
            },
        })

        return () => {
            webSocketClient.removeProtobuffListener(UserInventoryPetsData, listener);
        };
    }, [userPets]);

    useEffect(() => {
        if(!activePet && userPets.length) {
            setActivePet(userPets[0]);
        }
        else if(activePet && !userPets.some((userFurniture) => activePet.id === userFurniture.id)) {
            setActivePet(userPets[0] ?? undefined);
        }
        else if(activePet) {
            const active = userPets.find((userFurniture) => activePet.id === userFurniture.id);

            setActivePet(active);
        }
    }, [activePet, userPets]);

    useEffect(() => {
        if(!roomFurniturePlacer) {
            setDialogHidden("inventory", false);
            
            return;
        }

        if(!activePet || roomFurniturePlacerId.current !== activePet?.id) {
            roomFurniturePlacer.destroy();

            setRoomFurniturePlacer(undefined);

            setDialogHidden("inventory", false);

            return;
        }

        setDialogHidden("inventory", true);

        roomFurniturePlacer.startPlacing((position, direction) => {
            webSocketClient.sendProtobuff(PlaceRoomPetData, PlaceRoomPetData.create({
                id: activePet.id,
                
                position,
                direction
            }));
        }, () => {
            roomFurniturePlacer.destroy();

            setDialogHidden("inventory", false);

            setRoomFurniturePlacer(undefined);
        });

    }, [activePet, roomFurniturePlacer]);

    const onPlaceInRoomClick = useCallback(() => {
        if(!activePet?.pet) {
            return;
        }

        if(!clientInstance.roomInstance.value?.roomRenderer) {
            return;
        }

        setRoomFurniturePlacer(RoomFurniturePlacer.fromPetData(clientInstance.roomInstance.value, activePet.pet));
        roomFurniturePlacerId.current = activePet?.id;
    }, [roomFurniturePlacer, activePet]);

    if(!userPets.length) {
        return (<InventoryEmptyTab/>);
    }

    return (
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
                    {userPets?.map((userPet) => (
                        <DialogItem
                            key={userPet.id}
                            active={activePet?.id === userPet.id}
                            onClick={() => setActivePet(userPet)}
                            width={46}
                            style={{
                                overflow: "hidden"
                            }}>
                            <PetImage data={userPet.pet} headOnly/>
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
                {(activePet) && (
                    <Fragment>
                        <div style={{
                            flex: 1,

                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <PetImage data={activePet.pet}/>
                        </div>

                        <div>
                            <b>{activePet?.name}</b>
                        </div>

                        <DialogButton disabled={!room || room.information?.owner?.id !== user.id} onClick={onPlaceInRoomClick}>Place in room</DialogButton>
                    </Fragment>
                )}
            </div>
        </div>
    );
}
