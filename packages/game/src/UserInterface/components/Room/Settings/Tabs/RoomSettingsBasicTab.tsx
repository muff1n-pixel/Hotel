import { useCallback, useEffect, useState } from "react";
import { useRoomInstance } from "../../../../hooks/useRoomInstance";
import { webSocketClient } from "../../../../..";
import { UpdateRoomInformationEventData } from "@Shared/Communications/Requests/Rooms/UpdateRoomInformationEventData";
import Input from "../../../Form/Input";
import Selection from "../../../Form/Selection";
import { useRoomCategories } from "../../../../hooks/useRoomCategories";

export default function RoomSettingsBasicTab() {
    const room = useRoomInstance();
    const roomCategories = useRoomCategories();

    if(!room) {
        return;
    }

    const [name, setName] = useState(room?.information.name ?? "");
    const [description, setDescription] = useState(room?.information.description ?? "");

    useEffect(() => {
        const timeout = setTimeout(() => {
            webSocketClient.send<UpdateRoomInformationEventData>("UpdateRoomInformationEvent", {
                name
            });
        }, 500);

        return () => {
            clearTimeout(timeout);
        }
    }, [name]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            webSocketClient.send<UpdateRoomInformationEventData>("UpdateRoomInformationEvent", {
                description
            });
        }, 500);

        return () => {
            clearTimeout(timeout);
        }
    }, [description]);

    const handleCategoryChange = useCallback((categoryId: string) => {
        webSocketClient.send<UpdateRoomInformationEventData>("UpdateRoomInformationEvent", {
            category: categoryId
        });
    }, []);

    return (
        <div style={{
            flex: 1,

            display: "flex",
            flexDirection: "column",
            gap: 32,
        }}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 8
            }}>
                <b>Room name</b>

                <Input placeholder="My room name" value={name} onChange={setName}/>
                
                <b>Room description</b>

                <Input placeholder="My room description" value={description} onChange={setDescription}/>

                <b>Room category</b>

                <Selection value={room.information.category} items={roomCategories?.map((category) => {
                    return {
                        value: category.id,
                        label: category.title
                    };
                }) ?? []} onChange={(value) => handleCategoryChange(value as string)}/>
            </div>
        </div>
    );
}
