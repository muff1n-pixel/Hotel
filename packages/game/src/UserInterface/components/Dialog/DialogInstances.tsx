import { Fragment } from "react";
import WardrobeDialog from "../Wardrobe/WardrobeDialog";
import ShopDialog from "../Shop/ShopDialog";
import InventoryDialog from "../Inventory/InventoryDialog";
import NavigatorDialog from "../Navigator/NavigatorDialog";
import RoomCreationDialog from "../Navigator/Rooms/Creator/RoomCreationDialog";
import { useDialogs } from "../../hooks/useDialogs";
import RoomFurnitureLogicDialog, { RoomFurnitureLogicDialogData } from "../Room/Furniture/Logic/RoomFurnitureLogicDialog";
import RoomSettingsDialog from "../Room/Settings/RoomSettingsDialog";
import RoomInformationDialog from "../Room/Information/RoomInformationDialog";
import ReportIssueDialog from "../Debug/Dialog/ReportIssueDialog";
import HotelAlertDialog from "../Hotel/Alert/HotelAlertDialog";
import ViewIssuesDialog from "../Debug/Dialog/ViewIssuesDialog";
import RoomSettingsThumbnailDialog from "../Room/Settings/Thumbnail/RoomSettingsThumbnailDialog";
import EditShopPageDialog from "../Shop/Development/EditShopPageDialog";
import { ShopPageData } from "@Shared/Communications/Responses/Shop/ShopPagesEventData";
import EditShopFurnitureDialog from "../Shop/Development/EditShopFurnitureDialog";
import RoomFurnitureDialog from "../Room/Furniture/Dialogs/RoomFurnitureDialog";
import FigureCatalogDialog from "../Catalogs/FigureCatalogDialog";
import RoomFloorPlanDialog from "../Room/FloorPlan/RoomFloorPlanDialog";
import EditFurnitureDialog from "../Furniture/Dialogs/EditFurnitureDialog";
import EditShopBotDialog from "../Shop/Development/EditShopBotDialog";

export default function DialogInstances() {
    const { dialogs, closeDialog } = useDialogs();

    return (
        <Fragment>
            {dialogs.map((dialog) => {
                switch(dialog.type) {
                    case "alert":
                        return (<HotelAlertDialog key={dialog.id} data={dialog.data} hidden={dialog.hidden} onClose={() => closeDialog(dialog.id)}/>);

                    case "wardrobe":
                        return (<WardrobeDialog key={dialog.id} hidden={dialog.hidden} onClose={() => closeDialog(dialog.id)}/>);
                        
                    case "shop":
                        return (<ShopDialog key={dialog.id} hidden={dialog.hidden} onClose={() => closeDialog(dialog.id)}/>);
                        
                    case "inventory":
                        return (<InventoryDialog key={dialog.id} hidden={dialog.hidden} onClose={() => closeDialog(dialog.id)}/>);
                        
                    case "navigator":
                        return (<NavigatorDialog key={dialog.id} hidden={dialog.hidden} onClose={() => closeDialog(dialog.id)}/>);

                    case "room-information":
                        return (<RoomInformationDialog key={dialog.id} hidden={dialog.hidden} onClose={() => closeDialog(dialog.id)}/>);

                    case "room-settings":
                        return (<RoomSettingsDialog key={dialog.id} hidden={dialog.hidden} onClose={() => closeDialog(dialog.id)}/>);

                    case "room-settings-thumbnail":
                        return (<RoomSettingsThumbnailDialog key={dialog.id} hidden={dialog.hidden} onClose={() => closeDialog(dialog.id)}/>);
                        
                    case "room-creation":
                        return (<RoomCreationDialog key={dialog.id} hidden={dialog.hidden} onClose={() => closeDialog(dialog.id)}/>);

                    case "room-furniture-logic":
                        return (<RoomFurnitureLogicDialog key={dialog.id} data={dialog.data as RoomFurnitureLogicDialogData} hidden={dialog.hidden} onClose={() => closeDialog(dialog.id)}/>);
                        
                    case "room-furni":
                        return (<RoomFurnitureDialog key={dialog.id} hidden={dialog.hidden} onClose={() => closeDialog(dialog.id)}/>);

                    case "room-floorplan":
                        return (<RoomFloorPlanDialog key={dialog.id} hidden={dialog.hidden} onClose={() => closeDialog(dialog.id)}/>);

                    case "report-issue":
                        return (<ReportIssueDialog key={dialog.id} hidden={dialog.hidden} onClose={() => closeDialog(dialog.id)}/>);

                    case "view-issues":
                        return (<ViewIssuesDialog key={dialog.id} hidden={dialog.hidden} onClose={() => closeDialog(dialog.id)}/>);

                    case "edit-shop-page":
                        return (<EditShopPageDialog key={dialog.id} data={dialog.data as ShopPageData} hidden={dialog.hidden} onClose={() => closeDialog(dialog.id)}/>);

                    case "edit-shop-furniture":
                        return (<EditShopFurnitureDialog key={dialog.id} data={dialog.data as any} hidden={dialog.hidden} onClose={() => closeDialog(dialog.id)}/>);

                    case "edit-shop-bot":
                        return (<EditShopBotDialog key={dialog.id} data={dialog.data as any} hidden={dialog.hidden} onClose={() => closeDialog(dialog.id)}/>);

                    case "figure-catalog":
                        return (<FigureCatalogDialog key={dialog.id} hidden={dialog.hidden} onClose={() => closeDialog(dialog.id)}/>);

                    case "edit-furniture":
                        return (<EditFurnitureDialog key={dialog.id} data={dialog.data as any} hidden={dialog.hidden} onClose={() => closeDialog(dialog.id)}/>);
                }
            })}
        </Fragment>
    );
}
