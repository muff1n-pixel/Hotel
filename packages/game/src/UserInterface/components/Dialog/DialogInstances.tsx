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
import RoomChatCommandsDialog from "../Room/Chat/Commands/RoomChatCommandsDialog";
import SettingsDialog from "../Settings/SettingsDialog";

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
                    case "settings":
                        return (<SettingsDialog {...props} key={dialog.id}/>);
                        
                    case "alert":
                        return (<HotelAlertDialog {...props} key={dialog.id}/>);

                    case "wardrobe":
                        return (<WardrobeDialog {...props} key={dialog.id}/>);
                        
                    case "shop":
                        return (<ShopDialog {...props} key={dialog.id}/>);
                        
                    case "inventory":
                        return (<InventoryDialog {...props} key={dialog.id}/>);
                        
                    case "navigator":
                        return (<NavigatorDialog {...props} key={dialog.id}/>);

                    case "room-information":
                        return (<RoomInformationDialog {...props} key={dialog.id}/>);

                    case "room-settings":
                        return (<RoomSettingsDialog {...props} key={dialog.id}/>);

                    case "room-settings-thumbnail":
                        return (<RoomSettingsThumbnailDialog {...props} key={dialog.id}/>);
                        
                    case "room-creation":
                        return (<RoomCreationDialog {...props} key={dialog.id}/>);

                    case "room-furniture-logic":
                        return (<RoomFurnitureLogicDialog {...props} key={dialog.id}/>);
                        
                    case "room-furni":
                        return (<RoomFurnitureDialog {...props} key={dialog.id}/>);

                    case "room-floorplan":
                        return (<RoomFloorPlanDialog {...props} key={dialog.id}/>);

                    case "room-chat-commands":
                        return (<RoomChatCommandsDialog {...props} key={dialog.id}/>);

                    case "report-issue":
                        return (<ReportIssueDialog {...props} key={dialog.id}/>);

                    case "view-issues":
                        return (<ViewIssuesDialog {...props} key={dialog.id}/>);

                    case "edit-shop-page":
                        return (<EditShopPageDialog {...props} key={dialog.id}/>);

                    case "edit-shop-furniture":
                        return (<EditShopFurnitureDialog {...props} key={dialog.id}/>);

                    case "edit-shop-bot":
                        return (<EditShopBotDialog {...props} key={dialog.id}/>);

                    case "edit-shop-bot-figure":
                        return (<EditShopBotFigureDialog {...props} key={dialog.id}/>);

                    case "figure-catalog":
                        return (<FigureCatalogDialog {...props} key={dialog.id}/>);

                    case "bot-wardrobe":
                        return (<BotWardrobeDialog {...props} key={dialog.id}/>);

                    case "bot-speech":
                        return (<BotSpeechDialog {...props} key={dialog.id}/>);

                    case "edit-furniture":
                        return (<EditFurnitureDialog {...props} key={dialog.id}/>);

                    case "figure":
                        return (<FigureDialog {...props} key={dialog.id}/>);
                }
            })}
        </Fragment>
    );
}
