import { useContext } from "react";
import RoomChatMessage from "./RoomChatMessage";
import { AppContext } from "../../../contexts/AppContext";

export default function RoomChat() {
    const { user } = useContext(AppContext);

    if(!user) {
        return null;
    }

    return (
        <div style={{
            position: "absolute",
            left: 0,
            top: 0,

            width: "100%",
            height: "100%"
        }}>
            <RoomChatMessage style={"storm"} user="Muff1n-Pixel" figureConfiguration={user.figureConfiguration} message="Hello world"/>
            <RoomChatMessage style={"skeleton"} user="Muff1n-Pixel" figureConfiguration={user.figureConfiguration} message="Hello world Hello world Hello world Hello world"/>
            <RoomChatMessage style={"normal_blue"} user="Muff1n-Pixel" figureConfiguration={user.figureConfiguration} message="Hello world"/>
        </div>
    );
}
