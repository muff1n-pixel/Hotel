import { ShopFeatureData, ShopPageData } from "@pixel63/events";
import ShopPageFeatureImage from "@UserInterface/Components/Shop/Pages/Features/ShopPageFeatureImage";
import ShopPageFeatureTitle from "@UserInterface/Components/Shop/Pages/Features/ShopPageFeatureTitle";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { Fragment } from "react/jsx-runtime";

export type ShopPageVerticalFeatureProps = {
    page: ShopPageData;
    editMode?: boolean;

    feature?: ShopFeatureData;
    onClick?: (feature: ShopFeatureData) => void;
};

export default function ShopPageVerticalFeature({ feature, page, editMode, onClick }: ShopPageVerticalFeatureProps) {
    const dialogs = useDialogs();

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

            {(editMode) && (
                <div style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    cursor: "pointer"
                }} onClick={() => dialogs.addUniqueDialog("edit-shop-feature", { alignment: "vertical", feature, page }, "vertical")}>
                    <div className="sprite_room_user_motto_pen"/>
                </div>
            )}
        </div>
    );
}
