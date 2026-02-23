import { ShopPageData } from "@Shared/Communications/Responses/Shop/ShopPagesEventData";
import ShopDefaultPage from "./ShopDefaultPage";
import ShopFeaturesPage from "./ShopFeaturesPage";
import { ShopPageCategory } from "@Shared/Communications/Requests/Shop/GetShopPagesEventData";
import ShopTrophiesPage from "./ShopTrophiesPage";
import ShopBotsPage from "./ShopBotsPage";

export type ShopPageProps = {
    editMode?: boolean;
    page: ShopPageData;
    setActiveShopPage?: (page: { id: string; category: ShopPageCategory; }) => void;
}

export default function ShopPage({ editMode, page, setActiveShopPage }: ShopPageProps) {
    switch(page.type) {
        case "default":
            return (<ShopDefaultPage key={page.id} editMode={editMode} page={page}/>);
            
        case "trophies":
            return (<ShopTrophiesPage key={page.id} editMode={editMode} page={page}/>);
            
        case "bots":
            return (<ShopBotsPage key={page.id} editMode={editMode} page={page}/>);

        case "features":
            return (<ShopFeaturesPage key={page.id} editMode={editMode} page={page} setActiveShopPage={setActiveShopPage}/>);
        
        default:
            return <div/>;
    }
}
