import { BadgeData } from "@pixel63/events";
import { CSSProperties } from "react";

export type BadgeImageProps = {
    badge?: BadgeData;
    style?: CSSProperties;
}

export default function BadgeImage({ badge, style }: BadgeImageProps) {
    if(!badge) {
        return null;
    }
    
    return (
        <img src={`/assets/badges/${badge.image}`} data-tooltip={badge.name} style={style}/>
    );
}
