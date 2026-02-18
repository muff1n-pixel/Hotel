import { Fragment, useCallback, useEffect, useState } from "react";
import { ShopPageProps } from "./ShopPage";
import ShopPageFeatureImage from "./Features/ShopPageFeatureImage";
import ShopPageFeatureTitle from "./Features/ShopPageFeatureTitle";
import { ShopPageFeatureData } from "@Shared/Communications/Responses/Shop/ShopPagesEventData";

export default function ShopFeaturesPage({ page, setActiveShopPage }: ShopPageProps) {
    const [verticalFeature, setVerticalFeature] = useState(page.features?.find((feature) => feature.type === "vertical"));
    const [horizontalFeatures, setHorizontalFeatures] = useState(page.features?.filter((feature) => feature.type === "horizontal"));

    useEffect(() => {
        setVerticalFeature(page.features?.find((feature) => feature.type === "vertical"));
        setHorizontalFeatures(page.features?.filter((feature) => feature.type === "horizontal"));
    }, [ page.features ]);

    const handleFeatureClick = useCallback((feature: ShopPageFeatureData) => {
        setActiveShopPage?.(feature.page);
    }, [setActiveShopPage]);

    return (
        <div style={{
            flex: 1,

            display: "flex",
            flexDirection: "row",

            gap: 7
        }}>
            <div style={{
                width: 184,

                display: "flex",

                position: "relative",

                alignItems: "flex-end",

                cursor: "pointer",
                padding: 3,
                boxSizing: "border-box"
            }} onClick={() => verticalFeature && handleFeatureClick(verticalFeature)}>
                {(verticalFeature) && (
                    <Fragment>
                        <ShopPageFeatureImage feature={verticalFeature}/>

                        <ShopPageFeatureTitle feature={verticalFeature}/>
                    </Fragment>
                )}
            </div>

            <div style={{
                flex: 2,

                display: "flex",
                flexDirection: "column",
                gap: 7
            }}>
                {horizontalFeatures?.map((feature) => (
                    <div key={feature.id} style={{
                        height: 126,

                        display: "flex",

                        position: "relative",

                        alignItems: "flex-end",

                        cursor: "pointer",
                        padding: 3,
                        boxSizing: "border-box"
                    }} onClick={() => handleFeatureClick(feature)}>
                        <ShopPageFeatureImage feature={feature}/>

                        <ShopPageFeatureTitle feature={feature}/>
                    </div>
                ))}

                <div style={{
                    flex: 1
                }}/>
            </div>
        </div>
    );
}
