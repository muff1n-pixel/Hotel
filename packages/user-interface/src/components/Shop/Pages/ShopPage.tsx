import { ShopPageData } from "@shared/WebSocket/Events/Shop/ShopPagesResponse";
import ShopDefaultPage from "./ShopDefaultPage";

export type ShopPageProps = {
    page: ShopPageData;
}

export default function ShopPage({ page }: ShopPageProps) {
    switch(page.type) {
        case "default":
            return <ShopDefaultPage page={page}/>
        
        default:
            return <div/>;
    }
}
