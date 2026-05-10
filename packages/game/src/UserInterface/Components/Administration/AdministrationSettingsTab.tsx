import { webSocketClient } from "@Game/index";
import { GetHotelSettingsData, HotelSettingData, HotelSettingsData, UpdateHotelSettingData } from "@pixel63/events";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import DialogTable from "@UserInterface/Common/Dialog/Components/Table/DialogTable";
import Input from "@UserInterface/Common/Form/Components/Input";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import { useCallback, useEffect, useState } from "react";

export default function AdministrationSettingsTab() {
    const [activeSetting, setActiveSetting] = useState<HotelSettingData>();
    const [settings, setSettings] = useState<HotelSettingData[]>([]);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(HotelSettingsData, {
            async handle(payload: HotelSettingsData) {
                setSettings(payload.settings);
            },
        });

        webSocketClient.sendProtobuff(GetHotelSettingsData, GetHotelSettingsData.create({}));

        return () => {
            webSocketClient.removeProtobuffListener(HotelSettingsData, listener);
        };
    }, []);

    const handleUpdateSetting = useCallback(() => {
        if(!activeSetting) {
            return;
        }

        webSocketClient.sendProtobuff(UpdateHotelSettingData, UpdateHotelSettingData.create(activeSetting));
        setActiveSetting(undefined);
    }, [activeSetting]);

    return (
        <FlexLayout flex={1} direction="column">
            <DialogTable
                activeId={activeSetting?.id}
                columns={["Variable", "Value"]}
                items={settings.map((setting) => ({
                    id: setting.id,
                    values: [setting.id, setting.value],
                    onClick: () => setActiveSetting({...setting})
                }))}
                />
            
            {(activeSetting) && (
                <FlexLayout direction="row">
                    <FlexLayout justify="center" align="center" style={{ fontSize: 12 }}>
                        Changing <br/> {activeSetting.id}
                    </FlexLayout>

                    <div style={{ flex: 1 }}/>

                    <Input style={{ width: 100 }} type="number" value={activeSetting.value.toString()} onChange={(value) => setActiveSetting({ ...activeSetting, value: parseInt(value) })}/>

                    <DialogButton onClick={handleUpdateSetting}>Update</DialogButton>
                </FlexLayout>
            )}
        </FlexLayout>
    );
}
