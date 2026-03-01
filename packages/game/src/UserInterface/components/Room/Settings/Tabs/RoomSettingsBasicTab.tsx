import { Fragment, useCallback, useEffect, useState } from "react";
import { useRoomInstance } from "../../../../hooks/useRoomInstance";
import { webSocketClient } from "../../../../..";
import Input from "../../../Form/Input";
import Selection from "../../../Form/Selection";
import { useRoomCategories } from "../../../../hooks/useRoomCategories";
import { usePermissionAction } from "../../../../hooks/usePermissionAction";
import { UpdateRoomInformationData } from "@pixel63/events";

export default function RoomSettingsBasicTab() {
    const room = useRoomInstance();
    const roomCategories = useRoomCategories();
    
    const hasRoomTypePermissions = usePermissionAction("room:type");

    const [name, setName] = useState(room?.information?.name ?? "");
    const [description, setDescription] = useState(room?.information?.description ?? "");

    useEffect(() => {
        const timeout = setTimeout(() => {
            webSocketClient.sendProtobuff(UpdateRoomInformationData, UpdateRoomInformationData.create({
                name
            }));
        }, 500);

        return () => {
            clearTimeout(timeout);
        }
    }, [name]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            webSocketClient.sendProtobuff(UpdateRoomInformationData, UpdateRoomInformationData.create({
                description
            }));
        }, 500);

        return () => {
            clearTimeout(timeout);
        }
    }, [description]);

    const handleCategoryChange = useCallback((categoryId: string) => {
        webSocketClient.sendProtobuff(UpdateRoomInformationData, UpdateRoomInformationData.create({
            category: categoryId
        }));
    }, []);

    const handleTypeChange = useCallback((type: string) => {
        webSocketClient.sendProtobuff(UpdateRoomInformationData, UpdateRoomInformationData.create({
            type
        }));
    }, []);

    const handleMaxUsersChange = useCallback((maxUsers: number) => {
        webSocketClient.sendProtobuff(UpdateRoomInformationData, UpdateRoomInformationData.create({
            maxUsers
        }));
    }, []);

    if(!room) {
        return null;
    }

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

                <Selection value={room.information?.category} items={roomCategories?.map((category) => {
                    return {
                        value: category.id,
                        label: category.title
                    };
                }) ?? []} onChange={(value) => handleCategoryChange(value as string)}/>

                {(hasRoomTypePermissions) && (
                    <Fragment>
                        <b>Room type</b>

                        <Selection value={room.information?.type} items={[
                            {
                                value: "private",
                                label: "Private"
                            },
                            {
                                value: "public",
                                label: "Public"
                            }
                        ]} onChange={(value) => handleTypeChange(value as string)}/>
                    </Fragment>
                )}

                <b>Maximum amount of visitors</b>

                <Selection value={room.information?.maxUsers} items={Array.from({ length: 10 }, (_, index) => (index + 1) * 5).map((maxUsers) => {
                    return {
                        value: maxUsers,
                        label: maxUsers.toString()
                    };
                }) ?? []} onChange={(value) => handleMaxUsersChange(value as number)}/>
            </div>
        </div>
    );
}
