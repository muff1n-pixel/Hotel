import { useCallback, useState } from "react";
import { useRoomInstance } from "../../../../Hooks/useRoomInstance";
import Input from "../../../../Common/Form/Components/Input";
import Radio from "@UserInterface/Common/Form/Components/Radio";
import { webSocketClient } from "@Game/index";
import { UpdateRoomInformationData } from "@pixel63/events";

export default function RoomSettingsAccessTab() {
    const room = useRoomInstance();

    const [password, setPassword] = useState("");
    
    const handleLockChanged = useCallback((value: string) => {
        webSocketClient.sendProtobuff(UpdateRoomInformationData, UpdateRoomInformationData.create({
            lock: value
        }));
    }, []);
    
    const handlePasswordChanged = useCallback(() => {
        webSocketClient.sendProtobuff(UpdateRoomInformationData, UpdateRoomInformationData.create({
            password
        }));
    }, [password]);

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
                    <b>Room Access</b>

                    <p>Select access rights for the room. Open means everyone can enter; Locked restricts access to Habbos with a password; Private means Habbos have to ring your doorbell and wait to be let in.</p>
                </div>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8
                }}>
                    <b>Access to this room:</b>

                    <Radio value={room.information?.lock ?? "open"} onChange={handleLockChanged} items={[
                        {
                            label: "Open - anyone can enter",
                            value: "open"
                        },
                        {
                            label: "Visitors have to ring the doorbell",
                            value: "bell"
                        },
                        {
                            label: "Invisible in navigator to users without rights",
                            value: "invisible"
                        },
                        {
                            label: "Password is required to enter this room",
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
                        <b>Room Password</b>

                        <Input type="password" value={password} onChange={setPassword} onSubmit={handlePasswordChanged}/>

                        <p style={{ fontSize: 11 }}><i>If you already have a password set, it will not be shown here.</i></p>
                    </div>
                )}
            </div>
        </div>
    );
}
