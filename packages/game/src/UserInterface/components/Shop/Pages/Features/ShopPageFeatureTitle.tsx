import { ShopFeatureData } from "@pixel63/events";

export type ShopPageFeatureTitleProps = {
    feature: ShopFeatureData;
}

export default function ShopPageFeatureTitle({ feature }: ShopPageFeatureTitleProps) {
    return (
        <div style={{
            position: "relative",
            color: "#FFF",
            fontSize: 14.5,
            fontFamily: "Ubuntu Medium",

            background: "rgba(0, 0, 0, .5)",
            padding: 8,
            boxSizing: "border-box",
            borderRadius: 6
        }}>
            {feature.title}
        </div>
    );
}