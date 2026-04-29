import { Fragment } from "react";
import WardrobeDialog from "../../Components2/Wardrobe/WardrobeDialog";
import ShopDialog from "../../Components2/Shop/ShopDialog";
import InventoryDialog from "../../Components2/Inventory/InventoryDialog";
import NavigatorDialog from "../../Components2/Navigator/NavigatorDialog";
import RoomCreationDialog from "../../Components2/Navigator/Rooms/Creator/RoomCreationDialog";
import { useDialogs } from "../../Components/../Hooks/useDialogs";
import RoomFurnitureLogicDialog from "../../Components2/Room/Furniture/Logic/RoomFurnitureLogicDialog";
import RoomSettingsDialog from "../../Components2/Room/Settings/RoomSettingsDialog";
import RoomInformationDialog from "../../Components2/Room/Information/RoomInformationDialog";
import ReportIssueDialog from "../../Components2/Debug/Dialog/ReportIssueDialog";
import HotelAlertDialog from "../../Components2/Hotel/Alert/HotelAlertDialog";
import ViewIssuesDialog from "../../Components2/Debug/Dialog/ViewIssuesDialog";
import RoomSettingsThumbnailDialog from "../../Components2/Room/Settings/Thumbnail/RoomSettingsThumbnailDialog";
import EditShopPageDialog from "../../Components2/Shop/Development/EditShopPageDialog";
import EditShopFurnitureDialog from "../../Components2/Shop/Development/EditShopFurnitureDialog";
import RoomFurnitureDialog from "../../Components2/Room/Furniture/Dialogs/RoomFurnitureDialog";
import FigureCatalogDialog from "../../Components2/Catalogs/FigureCatalogDialog";
import RoomFloorPlanDialog from "../../Components2/Room/FloorPlan/RoomFloorPlanDialog";
import EditFurnitureDialog from "../../Components2/Furniture/Dialogs/EditFurnitureDialog";
import EditShopBotDialog from "../../Components2/Shop/Development/EditShopBotDialog";
import EditShopBotFigureDialog from "../../Components2/Shop/Development/EditShopBotFigureDialog";
import BotWardrobeDialog from "../../Components2/Bots/BotWardrobeDialog";
import BotSpeechDialog from "../../Components2/Bots/BotSpeechDialog";
import FigureDialog from "../../Components2/Figure/FigureDialog";
import RoomChatCommandsDialog from "../../Components2/Room/Chat/Commands/RoomChatCommandsDialog";
import SettingsDialog from "../../Components2/Settings/SettingsDialog";
import EditShopPetDialog from "../../Components2/Shop/Development/EditShopPetDialog";
import PetBrowserDialog from "../../Components2/Browsers/PetBrowserDialog";
import EditPetDialog from "../../Components2/Pets/EditPetDialog";
import FriendsDialog from "@UserInterface/Components2/Friends/FriendsDialog";
import MessengerDialog from "@UserInterface/Components2/Messenger/MessengerDialog";
import ModToolsDialog from "@UserInterface/Components2/Debug/Dialog/ModToolsDialog";
import FurnitureBrowserDialog from "@UserInterface/Components2/Browsers/FurnitureBrowserDialog";
import BadgeBrowserDialog from "@UserInterface/Components2/Browsers/BadgeBrowserDialog";
import EditBadgeDialog from "@UserInterface/Components2/Badges/EditBadgeDialog";
import RoomDoorbellDialog from "@UserInterface/Components2/Room/Doorbell/RoomDoorbellDialog";
import RoomDoorbellQueueDialog from "@UserInterface/Components2/Room/Doorbell/RoomDoorbellQueueDialog";
import RoomPasswordDialog from "@UserInterface/Components2/Room/Doorbell/RoomPasswordDialog";
import UserProfileDialog from "@UserInterface/Components2/Users/UserProfileDialog";
import RoomPasswordErrorDialog from "@UserInterface/Components2/Room/Doorbell/RoomPasswordErrorDialog";
import EditFurnitureCrackableDialog from "@UserInterface/Components2/Furniture/Dialogs/EditFurnitureCrackableDialog";
import AchievementsDialog from "@UserInterface/Components2/Achievements/AchievementsDialog";
import EditShopFeatureDialog from "@UserInterface/Components2/Shop/Development/EditShopFeatureDialog";
import EditShopFeatureCameraDialog from "@UserInterface/Components2/Shop/Development/EditShopFeatureCameraDialog";
import ClothingUnlockedDialog from "@UserInterface/Components2/Clothing/ClothingUnlockedDialog";
import WardrobeMannequinDialog from "@UserInterface/Components2/Wardrobe/WardrobeMannequinDialog";
import TraxEditorDialog from "@UserInterface/Components2/Room/Furniture/Logic/Trax/TraxEditorDialog";
import TraxPlaylistsDialog from "@UserInterface/Components2/Room/Furniture/Logic/Trax/TraxPlaylistsDialog";
import TraxSongNameDialog from "@UserInterface/Components2/Room/Furniture/Logic/Trax/TraxSongNameDialog";
import TraxPlaylistsSongDialog from "@UserInterface/Components2/Room/Furniture/Logic/Trax/TraxPlaylistsSongDialog";

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

                    case "trax-playlists-song":
                        return (<TraxPlaylistsSongDialog {...props} key={dialog.id}/>);

                    case "trax-editor":
                        return (<TraxEditorDialog {...props} key={dialog.id}/>);

                    case "trax-song-name":
                        return (<TraxSongNameDialog {...props} key={dialog.id}/>);
                }
            })}
        </Fragment>
    );
}
