import DialogTabs from "@UserInterface/Common/Dialog/Components/Tabs/DialogTabs";
import Dialog from "@UserInterface/Common/Dialog/Dialog";
import AdministrationFeedbackTab from "@UserInterface/Components/Administration/AdministrationFeedbackTab";
import AdministrationOverviewTab from "@UserInterface/Components/Administration/AdministrationOverviewTab";
import AdministrationSettingsTab from "@UserInterface/Components/Administration/AdministrationSettingsTab";
import AdministrationDebugTab from "./AdministrationDebugTab";
import AdministrationActivityRewardsTab from "./AdministrationActivityRewardsTab";
import { useTranslation } from "react-i18next";

export type AdministrationDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
}

export default function AdministrationDialog({ hidden, onClose }: AdministrationDialogProps) {
    const [getTranslation] = useTranslation("administration");

    return (
        <Dialog title={getTranslation("title")} hidden={hidden} onClose={onClose} width={500} height={320} editMode>
            <DialogTabs
                withoutHeader
                tabs={[
                    {
                        icon: getTranslation("tabs.overview"),
                        element: (<AdministrationOverviewTab/>)
                    },
                    {
                        icon: getTranslation("tabs.settings"),
                        element: (<AdministrationSettingsTab/>)
                    },
                    {
                        icon: getTranslation("tabs.activity_rewards"),
                        element: (<AdministrationActivityRewardsTab/>)
                    },
                    {
                        icon: getTranslation("tabs.feedback"),
                        element: (<AdministrationFeedbackTab/>)
                    },
                    {
                        icon: getTranslation("tabs.debug"),
                        element: (<AdministrationDebugTab/>)
                    }
                ]}
                />
        </Dialog>
    );
}
