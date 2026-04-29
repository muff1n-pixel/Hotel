import { CSSProperties, MouseEventHandler, PropsWithChildren } from "react";

import "./WardrobeSelectionItem.css";

export type WardrobeSelectionItemProps = PropsWithChildren & {
    active?: boolean;
    onClick?: MouseEventHandler;
    style?: CSSProperties;
}

export default function WardrobeSelectionItem({ active, children, style, onClick }: WardrobeSelectionItemProps) {
    return (
        <div className={(active)?("wardrobe-selection-item active"):("wardrobe-selection-item")} onClick={onClick} style={{
            width: 50,
            height: 50,

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            ...style
        }}>
            {children}
        </div>
    );
}
