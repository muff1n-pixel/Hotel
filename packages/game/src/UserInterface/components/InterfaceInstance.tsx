import { useEffect, useRef } from "react";
import { AppContext } from "../contexts/AppContext";
import Toolbar from "./Toolbar/Toolbar";
import RoomInterface from "./Room/RoomInterface";
import DialogInstances from "./Dialog/DialogInstances";
import { webSocketClient } from "../..";
import Reception from "./Reception/Reception";
import { useRoomInstance } from "../hooks/useRoomInstance";
import Widget from "./Widget/Widget";
import { useUser } from "../hooks/useUser";
import DebugInformationPanel from "./Debug/DebugInformationPanel";
import FlyingFurnitureInstances from "./Inventory/FlyingFurniture/FlyingFurnitureInstances";
import { GetUserData } from "@pixel63/events";

export default function InterfaceInstance() {
    const room = useRoomInstance();
    const user = useUser();
    
    const ready = useRef<boolean>(false);

    useEffect(() => {
        if(!ready.current) {
            webSocketClient.sendProtobuff(GetUserData, GetUserData.create({}));

            ready.current = true;
        }
    }, []);

    if(!user) {
        return null;
    }

    return (
        <AppContext value={null}>
            <DebugInformationPanel/>

            {(!room) && (
                <Reception/>
            )}

            <RoomInterface/>

            <DialogInstances/>

            <Toolbar/>
            <Widget/>

            <FlyingFurnitureInstances/>
        </AppContext>
    );
}