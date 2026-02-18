import { ShopPageData } from "@Shared/Communications/Responses/Shop/ShopPagesEventData";
import ShopDefaultPage from "./ShopDefaultPage";
import ShopFeaturesPage from "./ShopFeaturesPage";

export type ShopPageProps = {
    editMode?: boolean;
    page: ShopPageData;
    setActiveShopPage?: (page: ShopPageData) => void;
}

export default function ShopPage({ editMode, page, setActiveShopPage }: ShopPageProps) {
    switch(page.type) {
        case "default":
            return (<ShopDefaultPage key={page.id} editMode={editMode} page={page}/>);

        case "features":
            return (<ShopFeaturesPage key={page.id} editMode={editMode} page={page} setActiveShopPage={setActiveShopPage}/>);
        
        default:
            return <div/>;
    }
}
