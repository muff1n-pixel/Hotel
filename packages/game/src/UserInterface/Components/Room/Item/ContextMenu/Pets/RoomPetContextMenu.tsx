import RoomItemContextMenuWrapper from "../RoomItemContextMenuWrapper";
import UserContextMenuElement from "../../../Users/UserContextMenuElement";
import { Fragment, useEffect, useState } from "react";
import { useRoomInstance } from "../../../../../Hooks2/useRoomInstance";
import { useUser } from "../../../../../Hooks2/useUser";
import UserContextMenuButton from "../../../Users/UserContextMenuButton";
import RoomPetItem from "@Client/Room/Items/Pets/RoomPetItem";
import { PickupRoomPetData } from "@pixel63/events";
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
                    <UserContextMenuButton text={"Pick up"} onClick={() => {
                        webSocketClient.sendProtobuff(PickupRoomPetData, PickupRoomPetData.create({
                            id: pet.data.id
                        }));
                    }}/>
                </Fragment>
            )}
        </RoomItemContextMenuWrapper>
    );
}
