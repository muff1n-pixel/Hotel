import { Fragment, useCallback, useEffect, useState } from "react";
import { useRoomInstance } from "../../../../Hooks/useRoomInstance";
import { webSocketClient } from "../../../../..";
import Input from "../../../../Common/Form/Components/Input";
import Selection from "../../../../Common/Form/Components/Selection";
import { useRoomCategories } from "../../../../Hooks/useRoomCategories";
import { usePermissionAction } from "../../../../Hooks/usePermissionAction";
import { UpdateRoomInformationData } from "@pixel63/events";
import Checkbox from "@UserInterface/Common/Form/Components/Checkbox";
import { useTranslation } from "react-i18next";

export default function RoomSettingsBasicTab() {
    const [getTranslation] = useTranslation("room");
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
                <b>{getTranslation("settings.basic.name")}</b>

                <Input placeholder={getTranslation("settings.basic.name_placeholder")} value={name} onChange={setName}/>
                
                <b>{getTranslation("settings.basic.description")}</b>

                <Input placeholder={getTranslation("settings.basic.description_placeholder")} value={description} onChange={setDescription}/>

                <b>{getTranslation("settings.basic.category")}</b>

                <Selection value={room.information?.category} items={roomCategories?.map((category) => {
                    return {
                        value: category.id,
                        label: category.title
                    };
                }) ?? []} onChange={(value) => handleCategoryChange(value as string)}/>

                {(hasRoomTypePermissions) && (
                    <Fragment>
                        <b>{getTranslation("settings.basic.type")}</b>

                        <Selection value={room.information?.type} items={[
                            {
                                value: "private",
                                label: getTranslation("settings.basic.type_private")
                            },
                            {
                                value: "public",
                                label: getTranslation("settings.basic.type_public")
                            },
                            {
                                value: "bundle",
                                label: getTranslation("settings.basic.type_bundle")
                            }
                        ]} onChange={(value) => handleTypeChange(value as string)}/>
                    </Fragment>
                )}

                <b>{getTranslation("settings.basic.max_users")}</b>

                <Selection value={room.information?.maxUsers} items={Array.from({ length: 10 }, (_, index) => (index + 1) * 5).map((maxUsers) => {
                    return {
                        value: maxUsers,
                        label: maxUsers.toString()
                    };
                }) ?? []} onChange={(value) => handleMaxUsersChange(value as number)}/>

                <b>{getTranslation("settings.basic.trade")}</b>

                <Selection value={room.information?.trading} items={[
                    {
                        value: "everyone",
                        label: getTranslation("settings.basic.trade_everyone")
                    },
                    {
                        value: "rights",
                        label: getTranslation("settings.basic.trade_rights")
                    },
                    {
                        value: "disabled",
                        label: getTranslation("settings.basic.trade_disabled")
                    }
                ]} onChange={(value) => handleTradingChange(value as string)}/>

                <div/>

                <Checkbox value={room.information?.allowWalkingThroughUsers} label={getTranslation("settings.basic.allow_walking")} onChange={handleAllowWalkingThroughUsersChange}/>
            </div>
        </div>
    );
}
