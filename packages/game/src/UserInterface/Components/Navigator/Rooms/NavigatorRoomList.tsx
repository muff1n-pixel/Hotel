import { NavigatorRoomData } from "@pixel63/events";
import DialogList from "../../../Common/Dialog/Components/List/DialogList";
import DialogListContainer from "../../../Common/Dialog/Components/List/DialogListContainer";
import RoomThumbnail from "../../Room/Thumbnail/RoomThumbnail";
import NavigatorRoomListItem from "./NavigatorRoomListItem";
import NavigatorRoomUsersCount from "./NavigatorRoomUsersCount";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import NavigatorRoomListThumbnail from "./NavigatorRoomListThumbnail";
import { RefObject, useState } from "react";

export type NavigatorRoomListProps = {
    parentRef: RefObject<HTMLDivElement | null>;
    
    title: string;
   
    thumbnail?: boolean;
    
    rooms: NavigatorRoomData[];

    onClick: (room: NavigatorRoomListProps["rooms"][0]) => void;
};

export default function NavigatorRoomList({ parentRef, thumbnail, title, rooms, onClick }: NavigatorRoomListProps) {
    const [cards, setCards] = useState(thumbnail ?? false);

    return (
        <DialogListContainer title={title} cards={cards} onCardsToggle={setCards}>
            {(cards)?(
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 5
                }}>
                    {rooms.map((room) => (
                        <NavigatorRoomListThumbnail key={room.id} parentRef={parentRef} room={room} onClick={() => onClick(room)}/>
                    ))}
                </div>
            ):(
                <DialogList>
                    {rooms.map((room) => (
                        <NavigatorRoomListItem key={room.id} parentRef={parentRef} room={room} onClick={() => onClick(room)}/>
                    ))}
                </DialogList>
            )}
        </DialogListContainer>
    );
}
