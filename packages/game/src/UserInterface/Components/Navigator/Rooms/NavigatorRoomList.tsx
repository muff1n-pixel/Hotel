import { NavigatorRoomData } from "@pixel63/events";
import DialogList from "../../../Common/Dialog/Components/List/DialogList";
import DialogListContainer from "../../../Common/Dialog/Components/List/DialogListContainer";
import RoomThumbnail from "../../Room/Thumbnail/RoomThumbnail";
import NavigatorRoomListItem from "./NavigatorRoomListItem";
import NavigatorRoomUsersCount from "./NavigatorRoomUsersCount";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import NavigatorRoomListThumbnail from "./NavigatorRoomListThumbnail";

export type NavigatorRoomListProps = {
    title: string;
   
    thumbnail?: boolean;
    
    rooms: NavigatorRoomData[];

    onClick: (room: NavigatorRoomListProps["rooms"][0]) => void;
};

export default function NavigatorRoomList({ thumbnail, title, rooms, onClick }: NavigatorRoomListProps) {
    return (
        <DialogListContainer title={title}>
            {(thumbnail)?(
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 5
                }}>
                    {rooms.map((room) => (
                        <NavigatorRoomListThumbnail key={room.id} room={room} onClick={() => onClick(room)}/>
                    ))}
                </div>
            ):(
                <DialogList>
                    {rooms.map((room) => (
                        <NavigatorRoomListItem key={room.id} room={room} onClick={() => onClick(room)}/>
                    ))}
                </DialogList>
            )}
        </DialogListContainer>
    );
}
