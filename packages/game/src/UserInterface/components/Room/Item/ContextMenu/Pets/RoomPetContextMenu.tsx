import RoomItemContextMenuWrapper from "../RoomItemContextMenuWrapper";
import UserContextMenuElement from "../../../Users/UserContextMenuElement";
import { Fragment, useEffect, useState } from "react";
import { useRoomInstance } from "../../../../../hooks/useRoomInstance";
import { useUser } from "../../../../../hooks/useUser";
import UserContextMenuButton from "../../../Users/UserContextMenuButton";
import RoomPetItem from "@Client/Room/Items/Pets/RoomPetItem";

export type RoomPetContextMenuProps = {
    item: RoomPetItem;
};

export default function RoomPetContextMenu({ item }: RoomPetContextMenuProps) {
    const room = useRoomInstance();
    const user = useUser();

    const [pet, setPet] = useState(room?.getPetByItem(item));

    useEffect(() => {
        setPet(room?.getPetByItem(item));
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
                        /*webSocketClient.sendProtobuff(PickupRoomBotData, PickupRoomBotData.create({
                            id: pet.data.id
                        }));*/
                    }}/>
                </Fragment>
            )}
        </RoomItemContextMenuWrapper>
    );
}
