import { useEffect, useRef } from "react";
import { AppContext } from "../Contexts2/AppContext";
import Toolbar from "./Toolbar/Toolbar";
import RoomInterface from "./Room/RoomInterface";
import DialogInstances from "../Common/Dialog/DialogInstances";
import { clientInstance, webSocketClient } from "../..";
import Reception from "./Reception/Reception";
import { useRoomInstance } from "../Hooks2/useRoomInstance";
import Widget from "./Widget/Widget";
import { useUser } from "../Hooks2/useUser";
import DebugInformationPanel from "./Debug/DebugInformationPanel";
import FlyingFurnitureInstances from "./Inventory/FlyingFurniture/FlyingFurnitureInstances";
import { GetUserData } from "@pixel63/events";
import Tooltip from "@UserInterface/Common/Tooltip/Tooltip";
import FlowInstance from "@UserInterface/Components/Flow/FlowInstance";

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
            {(!room) && (
                <Reception/>
            )}

            <RoomInterface/>

            <DebugInformationPanel/>

            <DialogInstances/>

            <Toolbar/>

            <FlowInstance/>

            <FlyingFurnitureInstances/>

            <Tooltip hideTooltips={clientInstance.settings.value?.hideTooltips}/>
        </AppContext>
    );
}