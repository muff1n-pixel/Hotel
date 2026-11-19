import Dialog from "../../../Common/Dialog/Dialog";
import DialogTabs from "../../../Common/Dialog/Components/Tabs/DialogTabs";
import RoomSettingsBasicTab from "./Tabs/RoomSettingsBasicTab";
import RoomSettingsCustomizeTab from "./Tabs/RoomSettingsCustomizeTab";
import RoomSettingsAccessTab from "@UserInterface/Components/Room/Settings/Tabs/RoomSettingsAccessTab";
import RoomSettingsRightsTab from "@UserInterface/Components/Room/Settings/Tabs/RoomSettingsRightsTab";
import { useTranslation } from "react-i18next";

export type RoomSettingsDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomSettingsDialog({ hidden, onClose }: RoomSettingsDialogProps) {
    const [getTranslation] = useTranslation("room");
    return (
        <Dialog title={getTranslation("settings.title")} hidden={hidden} onClose={onClose} width={340} height={470} style={{ overflow: "visible" }}>
            <DialogTabs withoutHeader initialActiveIndex={0} tabs={[
                {
                    icon: getTranslation("settings.tabs.basic"),
                    element: (<RoomSettingsBasicTab/>),
                },
                {
                    icon: getTranslation("settings.tabs.access"),
                    element: (<RoomSettingsAccessTab/>),
                },
                {
                    icon: getTranslation("settings.tabs.rights"),
                    element: (<RoomSettingsRightsTab/>),
                },
                {
                    icon: getTranslation("settings.tabs.customize"),
                    element: (<RoomSettingsCustomizeTab/>),
                }
            ]}/>
        </Dialog>
    );
}
