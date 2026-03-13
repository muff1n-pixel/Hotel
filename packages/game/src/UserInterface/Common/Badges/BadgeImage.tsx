import { BadgeData } from "@pixel63/events";

export type BadgeImageProps = {
    badge?: BadgeData;
}

export default function BadgeImage({ badge }: BadgeImageProps) {
    if(!badge) {
        return null;
    }
    
    return (
        <img src={`/assets/badges/${badge.image}`}/>
    );
}
