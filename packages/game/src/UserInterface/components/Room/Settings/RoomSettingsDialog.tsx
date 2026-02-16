import Dialog from "../../Dialog/Dialog";
import DialogTabs from "../../Dialog/Tabs/DialogTabs";
import RoomSettingsBasicTab from "./Tabs/RoomSettingsBasicTab";
import RoomSettingsCustomizeTab from "./Tabs/RoomSettingsCustomizeTab";

export type RoomSettingsDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomSettingsDialog({ hidden, onClose }: RoomSettingsDialogProps) {
    return (
        <Dialog title="Room Settings" hidden={hidden} onClose={onClose} width={340} height={470} style={{ overflow: "visible" }}>
            <DialogTabs withoutHeader initialActiveIndex={3} tabs={[
                {
                    icon: "Basic",
                    element: (<RoomSettingsBasicTab/>),
                },
                {
                    icon: "Access",
                    element: (<div style={{ flex: 1 }}/>),
                },
                {
                    icon: "Rights",
                    element: (<div style={{ flex: 1 }}/>),
                },
                {
                    icon: "Customize",
                    element: (<RoomSettingsCustomizeTab/>),
                }
            ]}/>
        </Dialog>
    );
}
