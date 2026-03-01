import { NavigatorRoomData } from "@pixel63/events";
import DialogList from "../../Dialog/List/DialogList";
import DialogListContainer from "../../Dialog/List/DialogListContainer";
import RoomThumbnail from "../../Room/Thumbnail/RoomThumbnail";
import NavigatorRoomListItem from "./NavigatorRoomListItem";
import NavigatorRoomUsersCount from "./NavigatorRoomUsersCount";

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
                        <div key={room.id} style={{
                            background: "#EAE8DE",
                            
                            borderBottom: "2px solid #CCCCCC",
                            borderRadius: 6,

                            padding: 7,

                            display: "flex",
                            flexDirection: "column",

                            gap: 5,

                            cursor: "pointer"
                        }} onClick={() => onClick(room)}>
                            <RoomThumbnail roomId={room.id} thumbnail={room.thumbnail} disallowEdit>
                                <div style={{
                                    flex: 1,

                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "flex-end",

                                    padding: 4
                                }}>
                                    <div>
                                        <NavigatorRoomUsersCount users={room.users} maxUsers={room.maxUsers}/>
                                    </div>
                                </div>
                            </RoomThumbnail>

                            <div style={{ fontSize: 12 }}>{room.name}</div>
                        </div>
                    ))}
                </div>
            ):(
                <DialogList>
                    {rooms.map((room) => (
                        <NavigatorRoomListItem {...room} onClick={() => onClick(room)}/>
                    ))}
                </DialogList>
            )}
        </DialogListContainer>
    );
}
