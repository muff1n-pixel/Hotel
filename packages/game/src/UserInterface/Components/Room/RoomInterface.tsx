import RoomUserFriendRequests from "@UserInterface/Components2/Room/Users/Friends/RoomUserFriendRequests";
import { useRoomInstance } from "../../Hooks/useRoomInstance";
import RoomChat from "./Chat/RoomChat";
import RoomItemContextMenu from "./Item/ContextMenu/RoomItemContextMenu";
import RoomItemProfile from "./Item/RoomItemProfile";
import ToolbarRoomInfo from "./Toolbar/ToolbarRoomInfo";

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

            <RoomItemContextMenu/>

            <RoomUserFriendRequests/>

            <RoomItemProfile room={room}/>

            <ToolbarRoomInfo/>
        </div>
    );
}
