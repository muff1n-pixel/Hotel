import { useCallback, useEffect, useRef, useState } from "react";
import { AppContext, Dialog, TypedEventTarget } from "../contexts/AppContext";
import Toolbar from "./Toolbar/Toolbar";
import WebSocketClient from "@shared/WebSocket/WebSocketClient";
import WebSocketEvent from "@shared/WebSocket/Events/WebSocketEvent";
import { UserDataUpdated } from "@shared/WebSocket/Events/User/UserDataUpdated";
import { EnterRoom } from "@shared/WebSocket/Events/Rooms/EnterRoom";
import RoomInterface from "./Room/RoomInterface";
import DialogInstances from "./Dialog/DialogInstances";

export type InterfaceInstanceProps = {
    internalEventTarget: TypedEventTarget;
    webSocketClient: WebSocketClient;
}

export default function InterfaceInstance({ internalEventTarget, webSocketClient }: InterfaceInstanceProps) {
    const [dialogs, setDialogs] = useState<Dialog[]>([{ id:"shop", type: "shop", data: null }]);

    const ready = useRef<boolean>(false);
    const [user, setUser] = useState<UserDataUpdated>();

    useEffect(() => {
        const listener = (event: Event) => {
            //console.log("Received client ping in interface instance.", event);
        };

        internalEventTarget.addEventListener("client", listener);

        internalEventTarget.dispatchEvent(new Event("interface"));

        return () => internalEventTarget.removeEventListener("client", listener);
    }, []);

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

            user,

            internalEventTarget,
            webSocketClient
        }}>
            <RoomInterface/>

            <DialogInstances dialogs={dialogs}/>

            <Toolbar/>
        </AppContext>
    );
}