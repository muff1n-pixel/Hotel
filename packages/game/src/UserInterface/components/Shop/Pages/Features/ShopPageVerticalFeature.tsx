import { ShopFeatureData } from "@pixel63/events";
import ShopPageFeatureImage from "@UserInterface/Components/Shop/Pages/Features/ShopPageFeatureImage";
import ShopPageFeatureTitle from "@UserInterface/Components/Shop/Pages/Features/ShopPageFeatureTitle";
import { Fragment } from "react/jsx-runtime";

export type ShopPageVerticalFeatureProps = {
    feature?: ShopFeatureData;
    onClick?: (feature: ShopFeatureData) => void;
};

export default function ShopPageVerticalFeature({ feature, onClick }: ShopPageVerticalFeatureProps) {
    return (
        <div style={{
            width: 184,
            height: 497,

            display: "flex",

            position: "relative",

            background: "#CCCCCC",

            alignItems: "flex-end",

            cursor: (feature)?("pointer"):(undefined),
            padding: 3,
            boxSizing: "border-box"
        }} onClick={() => feature && onClick?.(feature)}>
            {(feature) && (
                <Fragment>
                    <ShopPageFeatureImage feature={feature}/>

                    <ShopPageFeatureTitle feature={feature}/>
                </Fragment>
            )}
        </div>
    );
}
