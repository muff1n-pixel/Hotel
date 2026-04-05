import { Fragment } from "react";
import WardrobeDialog from "../../Components/Wardrobe/WardrobeDialog";
import ShopDialog from "../../Components/Shop/ShopDialog";
import InventoryDialog from "../../Components/Inventory/InventoryDialog";
import NavigatorDialog from "../../Components/Navigator/NavigatorDialog";
import RoomCreationDialog from "../../Components/Navigator/Rooms/Creator/RoomCreationDialog";
import { useDialogs } from "../../Components/../Hooks/useDialogs";
import RoomFurnitureLogicDialog from "../../Components/Room/Furniture/Logic/RoomFurnitureLogicDialog";
import RoomSettingsDialog from "../../Components/Room/Settings/RoomSettingsDialog";
import RoomInformationDialog from "../../Components/Room/Information/RoomInformationDialog";
import ReportIssueDialog from "../../Components/Debug/Dialog/ReportIssueDialog";
import HotelAlertDialog from "../../Components/Hotel/Alert/HotelAlertDialog";
import ViewIssuesDialog from "../../Components/Debug/Dialog/ViewIssuesDialog";
import RoomSettingsThumbnailDialog from "../../Components/Room/Settings/Thumbnail/RoomSettingsThumbnailDialog";
import EditShopPageDialog from "../../Components/Shop/Development/EditShopPageDialog";
import EditShopFurnitureDialog from "../../Components/Shop/Development/EditShopFurnitureDialog";
import RoomFurnitureDialog from "../../Components/Room/Furniture/Dialogs/RoomFurnitureDialog";
import FigureCatalogDialog from "../../Components/Catalogs/FigureCatalogDialog";
import RoomFloorPlanDialog from "../../Components/Room/FloorPlan/RoomFloorPlanDialog";
import EditFurnitureDialog from "../../Components/Furniture/Dialogs/EditFurnitureDialog";
import EditShopBotDialog from "../../Components/Shop/Development/EditShopBotDialog";
import EditShopBotFigureDialog from "../../Components/Shop/Development/EditShopBotFigureDialog";
import BotWardrobeDialog from "../../Components/Bots/BotWardrobeDialog";
import BotSpeechDialog from "../../Components/Bots/BotSpeechDialog";
import FigureDialog from "../../Components/Figure/FigureDialog";
import RoomChatCommandsDialog from "../../Components/Room/Chat/Commands/RoomChatCommandsDialog";
import SettingsDialog from "../../Components/Settings/SettingsDialog";
import EditShopPetDialog from "../../Components/Shop/Development/EditShopPetDialog";
import PetBrowserDialog from "../../Components/Browsers/PetBrowserDialog";
import EditPetDialog from "../../Components/Pets/EditPetDialog";
import FriendsDialog from "src/UserInterface/Components/Friends/FriendsDialog";
import MessengerDialog from "src/UserInterface/Components/Messenger/MessengerDialog";
import ModToolsDialog from "@UserInterface/Components/Debug/Dialog/ModToolsDialog";
import FurnitureBrowserDialog from "@UserInterface/Components/Browsers/FurnitureBrowserDialog";
import BadgeBrowserDialog from "@UserInterface/Components/Browsers/BadgeBrowserDialog";
import EditBadgeDialog from "@UserInterface/Components/Badges/EditBadgeDialog";
import RoomDoorbellDialog from "@UserInterface/Components/Room/Doorbell/RoomDoorbellDialog";
import RoomDoorbellQueueDialog from "@UserInterface/Components/Room/Doorbell/RoomDoorbellQueueDialog";
import RoomPasswordDialog from "@UserInterface/Components/Room/Doorbell/RoomPasswordDialog";
import UserProfileDialog from "@UserInterface/Components/Users/UserProfileDialog";
import RoomPasswordErrorDialog from "@UserInterface/Components/Room/Doorbell/RoomPasswordErrorDialog";
import EditFurnitureCrackableDialog from "@UserInterface/Components/Furniture/Dialogs/EditFurnitureCrackableDialog";
import AchievementsDialog from "@UserInterface/Components/Achievements/AchievementsDialog";
import EditShopFeatureDialog from "@UserInterface/Components/Shop/Development/EditShopFeatureDialog";
import EditShopFeatureCameraDialog from "@UserInterface/Components/Shop/Development/EditShopFeatureCameraDialog";
import ClothingUnlockedDialog from "@UserInterface/Components/Clothing/ClothingUnlockedDialog";
import WardrobeMannequinDialog from "@UserInterface/Components/Wardrobe/WardrobeMannequinDialog";
import TraxEditorDialog from "@UserInterface/Components/Room/Furniture/Logic/Trax/TraxEditorDialog";
import TraxPlaylistsDialog from "@UserInterface/Components/Room/Furniture/Logic/Trax/TraxPlaylistsDialog";

export default function DialogInstances() {
    const { dialogs, closeDialog } = useDialogs();

    return (
        <Fragment>
            {dialogs.map((dialog) => {
                const props = {
                    key: dialog.id,
                    id: dialog.id,
                    data: dialog.data as any,
                    hidden: dialog.hidden,
                    onClose: () => closeDialog(dialog.id)
                };

                switch(dialog.type) {
                    case "modtools":
                        return (<ModToolsDialog {...props} key={dialog.id}/>);
                    
                    case "achievements":
                        return (<AchievementsDialog {...props} key={dialog.id}/>);

                    case "settings":
                        return (<SettingsDialog {...props} key={dialog.id}/>);
                        
                    case "alert":
                        return (<HotelAlertDialog {...props} key={dialog.id}/>);

                    case "wardrobe":
                        return (<WardrobeDialog {...props} key={dialog.id}/>);

                    case "wardrobe-mannequin":
                        return (<WardrobeMannequinDialog {...props} key={dialog.id}/>);
                       
                    case "clothing-unlocked":
                        return (<ClothingUnlockedDialog {...props} key={dialog.id}/>);

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

                    case "room-password":
                        return (<RoomPasswordDialog {...props} key={dialog.id}/>);
                        
                    case "room-password-error":
                        return (<RoomPasswordErrorDialog {...props} key={dialog.id}/>);

                    case "room-doorbell":
                        return (<RoomDoorbellDialog {...props} key={dialog.id}/>);

                    case "room-doorbell-queue":
                        return (<RoomDoorbellQueueDialog {...props} key={dialog.id}/>);

                    case "report-issue":
                        return (<ReportIssueDialog {...props} key={dialog.id}/>);

                    case "view-issues":
                        return (<ViewIssuesDialog {...props} key={dialog.id}/>);

                    case "edit-shop-page":
                        return (<EditShopPageDialog {...props} key={dialog.id}/>);

                    case "edit-shop-feature":
                        return (<EditShopFeatureDialog {...props} key={dialog.id}/>);

                    case "edit-shop-feature-camera":
                        return (<EditShopFeatureCameraDialog {...props} key={dialog.id}/>);

                    case "edit-shop-furniture":
                        return (<EditShopFurnitureDialog {...props} key={dialog.id}/>);

                    case "edit-shop-pet":
                        return (<EditShopPetDialog {...props} key={dialog.id}/>);

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

                    case "edit-furniture-crackable":
                        return (<EditFurnitureCrackableDialog {...props} key={dialog.id}/>);

                    case "figure":
                        return (<FigureDialog {...props} key={dialog.id}/>);

                    case "pet-browser":
                        return (<PetBrowserDialog {...props} key={dialog.id}/>);

                    case "furniture-browser":
                        return (<FurnitureBrowserDialog {...props} key={dialog.id}/>);

                    case "badge-browser":
                        return (<BadgeBrowserDialog {...props} key={dialog.id}/>);

                    case "edit-pet":
                        return (<EditPetDialog {...props} key={dialog.id}/>);

                    case "edit-badge":
                        return (<EditBadgeDialog {...props} key={dialog.id}/>);

                    case "friends":
                        return (<FriendsDialog {...props} key={dialog.id}/>);

                    case "messenger":
                        return (<MessengerDialog {...props} key={dialog.id}/>);

                    case "user-profile":
                        return (<UserProfileDialog {...props} key={dialog.id}/>);

                    case "trax-playlists":
                        return (<TraxPlaylistsDialog {...props} key={dialog.id}/>);

                    case "trax-editor":
                        return (<TraxEditorDialog {...props} key={dialog.id}/>);
                }
            })}
        </Fragment>
    );
}
