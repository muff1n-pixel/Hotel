import DialogTabs from "@UserInterface/Common/Dialog/Components/Tabs/DialogTabs";
import Dialog from "@UserInterface/Common/Dialog/Dialog";
import AdministrationFeedbackTab from "@UserInterface/Components/Administration/AdministrationFeedbackTab";
import AdministrationOverviewTab from "@UserInterface/Components/Administration/AdministrationOverviewTab";

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
                        icon: "Feedback",
                        element: (<AdministrationFeedbackTab/>)
                    }
                ]}
                />
        </Dialog>
    );
}
