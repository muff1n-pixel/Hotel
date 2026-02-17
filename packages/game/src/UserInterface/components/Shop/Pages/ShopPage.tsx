import { ShopPageData } from "@Shared/Communications/Responses/Shop/ShopPagesEventData";
import ShopDefaultPage from "./ShopDefaultPage";

export type ShopPageProps = {
    editMode?: boolean;
    page: ShopPageData;
}

export default function ShopPage({ editMode, page }: ShopPageProps) {
    switch(page.type) {
        case "default":
            return <ShopDefaultPage key={page.id} editMode={editMode} page={page}/>
        
        default:
            return <div/>;
    }
}
