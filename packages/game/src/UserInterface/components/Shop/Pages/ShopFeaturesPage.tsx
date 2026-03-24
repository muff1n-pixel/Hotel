import { useCallback } from "react";
import { ShopPageProps } from "./ShopPage";
import { ShopFeatureData } from "@pixel63/events";
import ShopPageHorizontalFeature from "@UserInterface/Components/Shop/Pages/Features/ShopPageHorizontalFeature";
import ShopPageVerticalFeature from "@UserInterface/Components/Shop/Pages/Features/ShopPageVerticalFeature";

export default function ShopFeaturesPage({ page, setActiveShopPage, editMode }: ShopPageProps) {
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
            <ShopPageVerticalFeature page={page} editMode={editMode} feature={page.featureVertical} onClick={handleFeatureClick}/>

            <div style={{
                flex: 2,

                display: "flex",
                flexDirection: "column",
                gap: 7
            }}>
                <ShopPageHorizontalFeature alignment="top" page={page} editMode={editMode} feature={page.featureHorizontalTop} onClick={handleFeatureClick}/>
                <ShopPageHorizontalFeature alignment="middle" page={page} editMode={editMode} feature={page.featureHorizontalMiddle} onClick={handleFeatureClick}/>
                <ShopPageHorizontalFeature alignment="bottom" page={page} editMode={editMode} feature={page.featureHorizontalBottom} onClick={handleFeatureClick}/>
                
                <div style={{
                    flex: 1
                }}/>
            </div>
        </div>
    );
}
