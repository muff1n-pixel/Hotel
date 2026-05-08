import DialogTabs from "@UserInterface/Common/Dialog/Components/Tabs/DialogTabs";
import Dialog from "@UserInterface/Common/Dialog/Dialog";
import RoomWiredMonitorTab from "@UserInterface/Components/Room/Wired/Tabs/Monitor/RoomWiredMonitorTab";
import { useTranslation } from "react-i18next";

export type RoomWiredDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomWiredDialog({ hidden, onClose }: RoomWiredDialogProps) {
    const [getWiredTranslation] = useTranslation("wired");

    return (
        <Dialog title={getWiredTranslation("creator_tools")} hidden={hidden} onClose={onClose} width={500} height={500}>
            <DialogTabs
                height={74}
                header={{
                    backgroundImage: "/assets/dialogs/headers/wired-header.png",
                    backgroundOpacity: 0.3
                }}
                tabs={[
                    {
                        icon: getWiredTranslation("monitor.monitor"),
                        element: (<RoomWiredMonitorTab/>)
                    }
                ]}/>
        </Dialog>
    );
}