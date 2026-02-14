import { BadgeData } from "@Shared/Interfaces/Badges/BadgeData";

export type BadgeImageProps = {
    badge: BadgeData;
}

export default function BadgeImage({ badge }: BadgeImageProps) {
    return (
        <img src={`/assets/badges/${badge.image}`}/>
    );
}
