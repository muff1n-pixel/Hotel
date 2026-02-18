import { ShopPageFeatureData } from "@Shared/Communications/Responses/Shop/ShopPagesEventData"

export type ShopPageFeatureImageProps = {
    feature: ShopPageFeatureData;
}

export default function ShopPageFeatureImage({ feature }: ShopPageFeatureImageProps) {
    return (
        <img style={{
            position: "absolute",
            
            left: 0,
            top: 0,

            width: "100%",
            height: "100%",

            borderRadius: 2,

            boxShadow: "1px 1px rgba(0, 0, 0, .2)",

            objectFit: "cover",
        }} src={`/assets/shop/features/${feature.image}`}/>
    );
}