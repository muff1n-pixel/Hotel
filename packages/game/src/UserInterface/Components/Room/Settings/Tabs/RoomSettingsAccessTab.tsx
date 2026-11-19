import { useCallback, useState } from "react";
import { useRoomInstance } from "../../../../Hooks/useRoomInstance";
import Input from "../../../../Common/Form/Components/Input";
import Radio from "@UserInterface/Common/Form/Components/Radio";
import { webSocketClient } from "@Game/index";
import { UpdateRoomInformationData } from "@pixel63/events";
import Checkbox from "@UserInterface/Common/Form/Components/Checkbox";
import { useTranslation } from "react-i18next";

export default function RoomSettingsAccessTab() {
    const [getTranslation] = useTranslation("room");
    const room = useRoomInstance();

    const [password, setPassword] = useState("");
    
    const handleLockChanged = useCallback((value: string) => {
        room?.websocket.sendProtobuff(UpdateRoomInformationData, UpdateRoomInformationData.create({
            lock: value
        }));
    }, [room]);
    
    const handlePasswordChanged = useCallback(() => {
        room?.websocket.sendProtobuff(UpdateRoomInformationData, UpdateRoomInformationData.create({
            password
        }));
    }, [password]);
    
    const handleAllowPetsChange = useCallback((allowPets: boolean) => {
        room?.websocket.sendProtobuff(UpdateRoomInformationData, UpdateRoomInformationData.create({
            allowPets
        }));
    }, [room]);
    
    const handleAllowPetsToEatFoodChange = useCallback((allowPetsToEatFood: boolean) => {
        room?.websocket.sendProtobuff(UpdateRoomInformationData, UpdateRoomInformationData.create({
            allowPetsToEatFood
        }));
    }, [room]);
    
    const handleMuteAllPetsChange = useCallback((muteAllPets: boolean) => {
        room?.websocket.sendProtobuff(UpdateRoomInformationData, UpdateRoomInformationData.create({
            muteAllPets
        }));
    }, [room]);

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
                gap: 16
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8
                }}>
                    <b>{getTranslation("settings.access.title")}</b>

                    <p>{getTranslation("settings.access.description")}</p>
                </div>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8
                }}>
                    <b>{getTranslation("settings.access.label")}</b>

                    <Radio value={room.information?.lock ?? "open"} onChange={handleLockChanged} items={[
                        {
                            label: getTranslation("settings.access.open"),
                            value: "open"
                        },
                        {
                            label: getTranslation("settings.access.bell"),
                            value: "bell"
                        },
                        {
                            label: getTranslation("settings.access.invisible"),
                            value: "invisible"
                        },
                        {
                            label: getTranslation("settings.access.password"),
                            value: "password"
                        }
                    ]}/>
                </div>

                {(room.information?.lock === "password") && (
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8
                    }}>
                        <b>{getTranslation("settings.access.password_title")}</b>

                        <Input type="password" value={password} onChange={setPassword} onSubmit={handlePasswordChanged}/>

                        <p style={{ fontSize: 11 }}><i>{getTranslation("settings.access.password_hint")}</i></p>
                    </div>
                )}

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8
                }}>
                    <b>{getTranslation("settings.access.pet_settings")}</b>

                    <Checkbox value={room.information?.allowPets} label={getTranslation("settings.access.allow_pets")} onChange={handleAllowPetsChange}/>
                    <Checkbox value={room.information?.allowPetsToEatFood} label={getTranslation("settings.access.allow_pets_eat")} onChange={handleAllowPetsToEatFoodChange}/>
                    <Checkbox value={room.information?.muteAllPets} label={getTranslation("settings.access.mute_pets")} onChange={handleMuteAllPetsChange}/>
                </div>
            </div>
        </div>
    );
}
