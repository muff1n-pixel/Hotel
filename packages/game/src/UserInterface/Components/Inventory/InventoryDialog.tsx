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
import { useUserBotNotifications } from "@UserInterface/Hooks/User/Notifications/useUserBotNotifications";
import { useUserPetNotifications } from "@UserInterface/Hooks/User/Notifications/useUserPetNotifications";
import { useUserBadgeNotifications } from "@UserInterface/Hooks/User/Notifications/useUserBadgeNotifications";

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
    const userPetNotifications = useUserPetNotifications();
    const userBotNotifications = useUserBotNotifications();
    const userBadgeNotifications = useUserBadgeNotifications();

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
                    icon: (
                        <FlexLayout direction="row" gap={5} align="center">
                            {getTranslation("tabs.pets")}

                            <NotificationIcon count={userPetNotifications.notifications.length}/>
                        </FlexLayout>
                    ),
                    element: (<InventoryPetsTab/>)
                },
                {
                    icon: (
                        <FlexLayout direction="row" gap={5} align="center">
                            {getTranslation("tabs.badges")}

                            <NotificationIcon count={userBadgeNotifications.notifications.length}/>
                        </FlexLayout>
                    ),
                    element: (<InventoryBadgesTab/>)
                },
                {
                    icon: (
                        <FlexLayout direction="row" gap={5} align="center">
                            {getTranslation("tabs.bots")}

                            <NotificationIcon count={userBotNotifications.notifications.length}/>
                        </FlexLayout>
                    ),
                    element: (<InventoryBotsTab/>)
                }
            ]}/>
        </Dialog>
    );
}
