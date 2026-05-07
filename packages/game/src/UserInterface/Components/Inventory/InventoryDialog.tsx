import Dialog from "../../Common/Dialog/Dialog";
import DialogTabs from "../../Common/Dialog/Components/Tabs/DialogTabs";
import InventoryBadgesTab from "./Tabs/InventoryBadgesTab";
import InventoryBotsTab from "./Tabs/InventoryBotsTab";
import InventoryFurnitureTab from "./Tabs/InventoryFurnitureTab";
import InventoryPetsTab from "./Tabs/InventoryPetsTab";
import { useTranslation } from "react-i18next";

export type InventoryDialogProps = {
    data?: {
        tab?: string;
    };
    hidden?: boolean;
    onClose: () => void;
};

export default function InventoryDialog({ data, hidden, onClose }: InventoryDialogProps) {
    const [getTranslation] = useTranslation("inventory");

    return (
        <Dialog title={getTranslation("title")} width={500} height={340} hidden={hidden} onClose={onClose}>
            <DialogTabs initialActiveIndex={["furniture", "pets", "badges", "bots"].indexOf(data?.tab ?? "furniture")} withoutHeader tabs={[
                {
                    icon: getTranslation("tabs.furniture"),
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
