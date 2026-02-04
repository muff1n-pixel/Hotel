import { useRoomInstance } from "../../hooks/useRoomInstance";
import RoomChat from "./Chat/RoomChat";
import RoomItemProfile from "./Item/RoomItemProfile";
import ToolbarRoomInfo from "./Toolbar/ToolbarRoomInfo";
import UserContextMenu from "./Users/UserContextMenu";

export default function RoomInterface() {
    const room = useRoomInstance();

    if(!room) {
        return null;
    }

    return (
        <div key={room.key} style={{
            position: "fixed",

            left: 0,
            top: 0,

            width: "100%",
            height: "100%",

            pointerEvents: "none"
        }}>
            <RoomChat/>

            <UserContextMenu/>

            <RoomItemProfile room={room}/>

            <ToolbarRoomInfo/>
        </div>
    );
}
