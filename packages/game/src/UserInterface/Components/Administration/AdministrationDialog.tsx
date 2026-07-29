import DialogTabs from "@UserInterface/Common/Dialog/Components/Tabs/DialogTabs";
import Dialog from "@UserInterface/Common/Dialog/Dialog";
import AdministrationFeedbackTab from "@UserInterface/Components/Administration/AdministrationFeedbackTab";
import AdministrationOverviewTab from "@UserInterface/Components/Administration/AdministrationOverviewTab";
import AdministrationSettingsTab from "@UserInterface/Components/Administration/AdministrationSettingsTab";
import AdministrationDebugTab from "./AdministrationDebugTab";

export type AdministrationDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function AdministrationDialog({ hidden, onClose }: AdministrationDialogProps) {
    return (
        <Dialog title="Administration" hidden={hidden} onClose={onClose} width={500} height={320}>
            <DialogTabs
                withoutHeader
                tabs={[
                    {
                        icon: "Overview",
                        element: (<AdministrationOverviewTab/>)
                    },
                    {
                        icon: "Settings",
                        element: (<AdministrationSettingsTab/>)
                    },
                    {
                        icon: "Feedback",
                        element: (<AdministrationFeedbackTab/>)
                    },
                    {
                        icon: "Debug",
                        element: (<AdministrationDebugTab/>)
                    }
                ]}
                />
        </Dialog>
    );
}
