import DialogTabs from "@UserInterface/Common/Dialog/Components/Tabs/DialogTabs";
import Dialog from "@UserInterface/Common/Dialog/Dialog";
import RoomWiredLogsTab from "@UserInterface/Components/Room/Wired/Tabs/Monitor/RoomWiredLogsTab";
import RoomWiredMonitorTab from "@UserInterface/Components/Room/Wired/Tabs/Monitor/RoomWiredMonitorTab";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export type RoomWiredDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export type RoomWiredTabProps = {
    onTabChange?: (tab: number) => void;
};

export default function RoomWiredDialog({ hidden, onClose }: RoomWiredDialogProps) {
    const [getTranslation] = useTranslation("wired");
    const [tab, setTab] = useState(0);

    return (
        <Dialog title={getTranslation("creator_tools")} hidden={hidden} onClose={onClose} width={500} height={500}>
            <DialogTabs
                index={tab}
                onChange={setTab}
                height={74}
                header={{
                    backgroundImage: "/assets/dialogs/headers/wired-header.png",
                    backgroundOpacity: 0.3
                }}
                tabs={[
                    {
                        icon: getTranslation("monitor.monitor"),
                        element: (<RoomWiredMonitorTab onTabChange={setTab}/>)
                    },
                    
                    {
                        icon: getTranslation("monitor.logs"),
                        element: (<RoomWiredLogsTab/>)
                    }
                ]}/>
        </Dialog>
    );
}