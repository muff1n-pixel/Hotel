import ShopDefaultPage from "./ShopDefaultPage";
import ShopFeaturesPage from "./ShopFeaturesPage";
import ShopTrophiesPage from "./ShopTrophiesPage";
import ShopBotsPage from "./ShopBotsPage";
import { ShopPageData } from "@pixel63/events";
import ShopPetsPage from "./ShopPetsPage";
import ShopBundlePage from "@UserInterface/Components/Shop/Pages/ShopBundlePage";
import ShopHabboClubPage from "@UserInterface/Components/Shop/Pages/ShopHabboClubPage";

export type ShopPageProps = {
    editMode?: boolean;
    page: ShopPageData;
    setActiveShopPage?: (page: { id: string; category: string; }) => void;
    
    requestedFurnitureId?: string;
}

export default function ShopPage({ editMode, page, setActiveShopPage, requestedFurnitureId }: ShopPageProps) {
    switch(page.type) {
        case "default":
            return (<ShopDefaultPage key={page.id} editMode={editMode} page={page} requestedFurnitureId={requestedFurnitureId}/>);

        case "bundle":
            return (<ShopBundlePage key={page.id} editMode={editMode} page={page} requestedFurnitureId={requestedFurnitureId}/>);
            
        case "trophies":
            return (<ShopTrophiesPage key={page.id} editMode={editMode} page={page} requestedFurnitureId={requestedFurnitureId}/>);
            
        case "bots":
            return (<ShopBotsPage key={page.id} editMode={editMode} page={page} requestedFurnitureId={requestedFurnitureId}/>);
            
        case "pets":
            return (<ShopPetsPage key={page.id} editMode={editMode} page={page} requestedFurnitureId={requestedFurnitureId}/>);

        case "features":
            return (<ShopFeaturesPage key={page.id} editMode={editMode} page={page} requestedFurnitureId={requestedFurnitureId} setActiveShopPage={setActiveShopPage}/>);
            
        case "habbo_club":
            return (<ShopHabboClubPage key={page.id} editMode={editMode} page={page} requestedFurnitureId={requestedFurnitureId}/>);
        
        default:
            return <div/>;
    }
}
