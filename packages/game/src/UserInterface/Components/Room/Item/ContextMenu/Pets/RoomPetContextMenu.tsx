import RoomItemContextMenuWrapper from "../RoomItemContextMenuWrapper";
import UserContextMenuElement from "../../../Users/UserContextMenuElement";
import { Fragment, useEffect, useState } from "react";
import { useRoomInstance } from "../../../../../Hooks/useRoomInstance";
import { useUser } from "../../../../../Hooks/useUser";
import UserContextMenuButton from "../../../Users/UserContextMenuButton";
import RoomPetItem from "@Client/Room/Items/Pets/RoomPetItem";
import { PickupRoomPetData, ScratchRoomPetData } from "@pixel63/events";
import { webSocketClient } from "../../../../../..";

export type RoomPetContextMenuProps = {
    item: RoomPetItem;
};

export default function RoomPetContextMenu({ item }: RoomPetContextMenuProps) {
    const room = useRoomInstance();
    const user = useUser();

    const [pet, setPet] = useState(room?.pets.find((pet) => pet.item.id === item.id));

    useEffect(() => {
        setPet(room?.pets.find((pet) => pet.item.id === item.id));
    }, [room, item]);

    if(!pet) {
        return null;
    }
    
    return (
        <RoomItemContextMenuWrapper item={item}>
            <UserContextMenuElement position="top">
                {pet.data.name}
            </UserContextMenuElement>

            {(pet.data.userId === user.id) && (
                <Fragment>
                    {(user.scratches > 0) && (
                        <UserContextMenuButton text={`Scratch (${user.scratches})`} onClick={() => {
                            room?.websocket.sendProtobuff(ScratchRoomPetData, ScratchRoomPetData.create({
                                petId: pet.data.id
                            }));
                        }}/>
                    )}

                    <UserContextMenuButton text={"Pick up"} onClick={() => {
                        room?.websocket.sendProtobuff(PickupRoomPetData, PickupRoomPetData.create({
                            id: pet.data.id
                        }));
                    }}/>
                </Fragment>
            )}
        </RoomItemContextMenuWrapper>
    );
}
