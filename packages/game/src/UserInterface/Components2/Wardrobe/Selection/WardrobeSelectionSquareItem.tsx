import { CSSProperties, MouseEventHandler, PropsWithChildren } from "react";

import "./WardrobeSelectionItem.css";

export type WardrobeSelectionItemProps = PropsWithChildren & {
    active?: boolean;
    onClick?: MouseEventHandler;
    style?: CSSProperties;
}

export default function WardrobeSelectionSquareItem({ active, children, style, onClick }: WardrobeSelectionItemProps) {
    return (
        <div className={(active)?("wardrobe-selection-square-item active"):("wardrobe-selection-square-item")} onClick={onClick} style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            ...style
        }}>
            {children}
        </div>
    );
}
