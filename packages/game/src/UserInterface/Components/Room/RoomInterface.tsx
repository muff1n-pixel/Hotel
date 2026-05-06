import RoomUserFriendRequests from "@UserInterface/Components/Room/Users/Friends/RoomUserFriendRequests";
import { useRoomInstance } from "../../Hooks/useRoomInstance";
import RoomChat from "./Chat/RoomChat";
import RoomItemContextMenu from "./Item/ContextMenu/RoomItemContextMenu";
import RoomItemProfile from "./Item/RoomItemProfile";
import ToolbarRoomInfo from "./Toolbar/ToolbarRoomInfo";
import RoomUserTradeRequests from "@UserInterface/Components/Room/Users/Trading/RoomUserTradeRequests";

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
            <RoomUserTradeRequests/>

            <RoomItemProfile room={room}/>

            <ToolbarRoomInfo/>
        </div>
    );
}
