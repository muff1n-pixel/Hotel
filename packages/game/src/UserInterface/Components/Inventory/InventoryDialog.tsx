import Dialog from "../../Common/Dialog/Dialog";
import DialogTabs from "../../Common/Dialog/Components/Tabs/DialogTabs";
import InventoryBadgesTab from "./Tabs/InventoryBadgesTab";
import InventoryBotsTab from "./Tabs/InventoryBotsTab";
import InventoryFurnitureTab from "./Tabs/InventoryFurnitureTab";
import InventoryPetsTab from "./Tabs/InventoryPetsTab";
import { useTranslation } from "react-i18next";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import NotificationIcon from "@UserInterface/Common/Notifications/NotificationIcon";
import { useUserFurnitureNotifications } from "@UserInterface/Hooks/User/Notifications/useUserFurnitureNotifications";

export type InventoryDialogProps = {
    data?: {
        tab?: string;
    };
    hidden?: boolean;
    onClose: () => void;
};

export default function InventoryDialog({ data, hidden, onClose }: InventoryDialogProps) {
    const [getTranslation] = useTranslation("inventory");

    const userFurnitureNotifications = useUserFurnitureNotifications();

    return (
        <Dialog title={getTranslation("title")} width={500} height={350} hidden={hidden} onClose={onClose}>
            <DialogTabs initialActiveIndex={["furniture", "pets", "badges", "bots"].indexOf(data?.tab ?? "furniture")} withoutHeader tabs={[
                {
                    icon: (
                        <FlexLayout direction="row" gap={5} align="center">
                            {getTranslation("tabs.furniture")}

                            <NotificationIcon count={userFurnitureNotifications.notifications.length}/>
                        </FlexLayout>
                    ),
                    element: (<InventoryFurnitureTab allowPlacingInRoom/>)
                },
                {
                    icon: getTranslation("tabs.pets"),
                    element: (<InventoryPetsTab/>)
                },
                {
                    icon: getTranslation("tabs.badges"),
                    element: (<InventoryBadgesTab/>)
                },
                {
                    icon: getTranslation("tabs.bots"),
                    element: (<InventoryBotsTab/>)
                }
            ]}/>
        </Dialog>
    );
}
