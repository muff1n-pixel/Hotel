import { Fragment, useCallback, useEffect, useState } from "react";
import { useRoomInstance } from "../../../../Hooks/useRoomInstance";
import { webSocketClient } from "../../../../..";
import Input from "../../../../Common/Form/Components/Input";
import Selection from "../../../../Common/Form/Components/Selection";
import { useRoomCategories } from "../../../../Hooks/useRoomCategories";
import { usePermissionAction } from "../../../../Hooks/usePermissionAction";
import { UpdateRoomInformationData } from "@pixel63/events";
import Checkbox from "@UserInterface/Common/Form/Components/Checkbox";

export default function RoomSettingsBasicTab() {
    const room = useRoomInstance();
    const roomCategories = useRoomCategories();
    
    const hasRoomTypePermissions = usePermissionAction("room:type");

    const [name, setName] = useState(room?.information?.name ?? "");
    const [description, setDescription] = useState(room?.information?.description ?? "");

    useEffect(() => {
        const timeout = setTimeout(() => {
            room?.websocket.sendProtobuff(UpdateRoomInformationData, UpdateRoomInformationData.create({
                name
            }));
        }, 500);

        return () => {
            clearTimeout(timeout);
        }
    }, [name, room]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            room?.websocket.sendProtobuff(UpdateRoomInformationData, UpdateRoomInformationData.create({
                description
            }));
        }, 500);

        return () => {
            clearTimeout(timeout);
        }
    }, [description, room]);

    const handleCategoryChange = useCallback((categoryId: string) => {
        room?.websocket.sendProtobuff(UpdateRoomInformationData, UpdateRoomInformationData.create({
            category: categoryId
        }));
    }, [ room ]);

    const handleTypeChange = useCallback((type: string) => {
        room?.websocket.sendProtobuff(UpdateRoomInformationData, UpdateRoomInformationData.create({
            type
        }));
    }, [ room ]);

    const handleMaxUsersChange = useCallback((maxUsers: number) => {
        room?.websocket.sendProtobuff(UpdateRoomInformationData, UpdateRoomInformationData.create({
            maxUsers
        }));
    }, [ room ]);

    const handleTradingChange = useCallback((trading: string) => {
        room?.websocket.sendProtobuff(UpdateRoomInformationData, UpdateRoomInformationData.create({
            trading
        }));
    }, [ room ]);

    const handleAllowWalkingThroughUsersChange = useCallback((allowWalkingThroughUsers: boolean) => {
        room?.websocket.sendProtobuff(UpdateRoomInformationData, UpdateRoomInformationData.create({
            allowWalkingThroughUsers
        }));
    }, [ room ]);

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
                            },
                            {
                                value: "bundle",
                                label: "Bundle"
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

                <b>Trade settings</b>

                <Selection value={room.information?.trading} items={[
                    {
                        value: "everyone",
                        label: "Everyone is allowed to trade"
                    },
                    {
                        value: "rights",
                        label: "Users with rights are allowed to trade"
                    },
                    {
                        value: "disabled",
                        label: "No one is allowed to trade"
                    }
                ]} onChange={(value) => handleTradingChange(value as string)}/>

                <div/>

                <Checkbox value={room.information?.allowWalkingThroughUsers} label="Allow walking through users" onChange={handleAllowWalkingThroughUsersChange}/>
            </div>
        </div>
    );
}
