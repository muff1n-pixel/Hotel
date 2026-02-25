import { Fragment } from "react";
import WardrobeDialog from "../Wardrobe/WardrobeDialog";
import ShopDialog from "../Shop/ShopDialog";
import InventoryDialog from "../Inventory/InventoryDialog";
import NavigatorDialog from "../Navigator/NavigatorDialog";
import RoomCreationDialog from "../Navigator/Rooms/Creator/RoomCreationDialog";
import { useDialogs } from "../../hooks/useDialogs";
import RoomFurnitureLogicDialog from "../Room/Furniture/Logic/RoomFurnitureLogicDialog";
import RoomSettingsDialog from "../Room/Settings/RoomSettingsDialog";
import RoomInformationDialog from "../Room/Information/RoomInformationDialog";
import ReportIssueDialog from "../Debug/Dialog/ReportIssueDialog";
import HotelAlertDialog from "../Hotel/Alert/HotelAlertDialog";
import ViewIssuesDialog from "../Debug/Dialog/ViewIssuesDialog";
import RoomSettingsThumbnailDialog from "../Room/Settings/Thumbnail/RoomSettingsThumbnailDialog";
import EditShopPageDialog from "../Shop/Development/EditShopPageDialog";
import EditShopFurnitureDialog from "../Shop/Development/EditShopFurnitureDialog";
import RoomFurnitureDialog from "../Room/Furniture/Dialogs/RoomFurnitureDialog";
import FigureCatalogDialog from "../Catalogs/FigureCatalogDialog";
import RoomFloorPlanDialog from "../Room/FloorPlan/RoomFloorPlanDialog";
import EditFurnitureDialog from "../Furniture/Dialogs/EditFurnitureDialog";
import EditShopBotDialog from "../Shop/Development/EditShopBotDialog";
import EditShopBotFigureDialog from "../Shop/Development/EditShopBotFigureDialog";
import BotWardrobeDialog from "../Bots/BotWardrobeDialog";
import BotSpeechDialog from "../Bots/BotSpeechDialog";
import FigureDialog from "../Figure/FigureDialog";

export default function DialogInstances() {
    const { dialogs, closeDialog } = useDialogs();

    return (
        <Fragment>
            {dialogs.map((dialog) => {
                const props = {
                    key: dialog.id,
                    data: dialog.data as any,
                    hidden: dialog.hidden,
                    onClose: () => closeDialog(dialog.id)
                };

                switch(dialog.type) {
                    case "alert":
                        return (<HotelAlertDialog {...props}/>);

                    case "wardrobe":
                        return (<WardrobeDialog {...props}/>);
                        
                    case "shop":
                        return (<ShopDialog {...props}/>);
                        
                    case "inventory":
                        return (<InventoryDialog {...props}/>);
                        
                    case "navigator":
                        return (<NavigatorDialog {...props}/>);

                    case "room-information":
                        return (<RoomInformationDialog {...props}/>);

                    case "room-settings":
                        return (<RoomSettingsDialog {...props}/>);

                    case "room-settings-thumbnail":
                        return (<RoomSettingsThumbnailDialog {...props}/>);
                        
                    case "room-creation":
                        return (<RoomCreationDialog {...props}/>);

                    case "room-furniture-logic":
                        return (<RoomFurnitureLogicDialog {...props}/>);
                        
                    case "room-furni":
                        return (<RoomFurnitureDialog {...props}/>);

                    case "room-floorplan":
                        return (<RoomFloorPlanDialog {...props}/>);

                    case "report-issue":
                        return (<ReportIssueDialog {...props}/>);

                    case "view-issues":
                        return (<ViewIssuesDialog {...props}/>);

                    case "edit-shop-page":
                        return (<EditShopPageDialog {...props}/>);

                    case "edit-shop-furniture":
                        return (<EditShopFurnitureDialog {...props}/>);

                    case "edit-shop-bot":
                        return (<EditShopBotDialog {...props}/>);

                    case "edit-shop-bot-figure":
                        return (<EditShopBotFigureDialog {...props}/>);

                    case "figure-catalog":
                        return (<FigureCatalogDialog {...props}/>);

                    case "bot-wardrobe":
                        return (<BotWardrobeDialog {...props}/>);

                    case "bot-speech":
                        return (<BotSpeechDialog {...props}/>);

                    case "edit-furniture":
                        return (<EditFurnitureDialog {...props}/>);

                    case "figure":
                        return (<FigureDialog {...props}/>);
                }
            })}
        </Fragment>
    );
}
