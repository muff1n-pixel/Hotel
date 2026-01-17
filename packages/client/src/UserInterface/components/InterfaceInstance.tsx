import { useCallback, useEffect, useRef, useState } from "react";
import { AppContext, Dialog } from "../contexts/AppContext";
import Toolbar from "./Toolbar/Toolbar";
import WebSocketEvent from "@Shared/WebSocket/Events/WebSocketEvent";
import { UserDataUpdated } from "@Shared/WebSocket/Events/User/UserDataUpdated";
import { EnterRoom } from "@Shared/WebSocket/Events/Rooms/EnterRoom";
import RoomInterface from "./Room/RoomInterface";
import DialogInstances from "./Dialog/DialogInstances";
import { webSocketClient } from "../..";

export type InterfaceInstanceProps = {
}

export default function InterfaceInstance({  }: InterfaceInstanceProps) {
    const [dialogs, setDialogs] = useState<Dialog[]>([{ id:"inventory", type: "inventory", data: null }]);

    const ready = useRef<boolean>(false);
    const [user, setUser] = useState<UserDataUpdated>();

    useEffect(() => {
        const listener = (event: WebSocketEvent<UserDataUpdated>) => {
            setUser(event.data);
        };

        webSocketClient.addEventListener("UserDataUpdated", listener);

        return () => {
            webSocketClient.removeEventListener("UserDataUpdated", listener);
        };
    }, []);

    useEffect(() => {
        if(!ready.current) {
            webSocketClient.send("RequestUserData", null);

            webSocketClient.send<EnterRoom>("EnterRoom", {
                roomId: "room1"
            });

            ready.current = true;
        }
    }, []);

    const addUniqueDialog = useCallback((type: string) => {
        if(dialogs.some((dialog) => dialog.id === type)) {
            closeDialog(type);
            
            return;
        }

        setDialogs(dialogs.concat({
            id: type,
            data: null,
            type
        }));
    }, [dialogs, user]);

    const closeDialog = useCallback((id: string) => {
        const index = dialogs.findIndex((dialog) => dialog.id === id);

        if(index === -1) {
            console.warn("Dialog does not exist", id);

            return;
        }

        setDialogs(dialogs.filter((dialog) => dialog.id !== id));
    }, [dialogs, user]);

    if(!user) {
        return null;
    }

    return (
        <AppContext value={{
            dialogs,
            addUniqueDialog,
            closeDialog,

            user
        }}>
            <RoomInterface/>

            <DialogInstances dialogs={dialogs}/>

            <Toolbar/>
        </AppContext>
    );
}