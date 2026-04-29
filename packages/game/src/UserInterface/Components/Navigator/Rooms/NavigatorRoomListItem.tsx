import { useRef, useState } from "react";
import NavigatorRoomUsersCount from "./NavigatorRoomUsersCount";
import NavigatorRoomProfile from "@UserInterface/Components/Navigator/Rooms/NavigatorRoomProfile";
import { NavigatorRoomData } from "@pixel63/events";
import NavigatorRoomLock from "@UserInterface/Components/Navigator/Rooms/NavigatorRoomLock";

export type NavigatorRoomListItemProps = {
    room: NavigatorRoomData;
    onClick: () => void;
}

export default function NavigatorRoomListItem({ room, onClick }: NavigatorRoomListItemProps) {
    const elementRef = useRef<HTMLDivElement>(null);

    const [hovered, setHovered] = useState(false);

    return (
        <div ref={elementRef} style={{
            flex: 1,

            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            
            gap: 8,

            position: "relative"
        }} onClick={onClick}>
            <NavigatorRoomUsersCount users={room.users} maxUsers={room.maxUsers}/>

            <div style={{
                flex: 1
            }}>
                {room.name}
            </div>

            <NavigatorRoomLock room={room}/>

            <div className="sprite_navigator_information" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}/>

            {(hovered) && (
                <NavigatorRoomProfile
                    elementRef={elementRef}
                    room={room}/>
            )}
        </div>
    );
}
