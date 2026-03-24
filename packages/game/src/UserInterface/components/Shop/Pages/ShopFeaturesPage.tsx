import { useCallback } from "react";
import { ShopPageProps } from "./ShopPage";
import { ShopFeatureData } from "@pixel63/events";
import ShopPageHorizontalFeature from "@UserInterface/Components/Shop/Pages/Features/ShopPageHorizontalFeature";
import ShopPageVerticalFeature from "@UserInterface/Components/Shop/Pages/Features/ShopPageVerticalFeature";

export default function ShopFeaturesPage({ page, setActiveShopPage }: ShopPageProps) {
    const handleFeatureClick = useCallback((feature: ShopFeatureData) => {
        if(feature.featuredPage) {
            setActiveShopPage?.(feature.featuredPage);
        }
    }, [setActiveShopPage]);

    return (
        <div style={{
            flex: 1,

            display: "flex",
            flexDirection: "row",

            gap: 7
        }}>
            <ShopPageVerticalFeature feature={page.featureVertical} onClick={handleFeatureClick}/>

            <div style={{
                flex: 2,

                display: "flex",
                flexDirection: "column",
                gap: 7
            }}>
                <ShopPageHorizontalFeature feature={page.featureHorizontalTop} onClick={handleFeatureClick}/>
                <ShopPageHorizontalFeature feature={page.featureHorizontalMiddle} onClick={handleFeatureClick}/>
                <ShopPageHorizontalFeature feature={page.featureHorizontalBottom} onClick={handleFeatureClick}/>
                
                <div style={{
                    flex: 1
                }}/>
            </div>
        </div>
    );
}
