export type MembershipSmallIconProps = {
    membership: string;
}

export default function MembershipSmallIcon({ membership }: MembershipSmallIconProps) {
    switch(membership) {
        case "habboclub": {
            return (<div className="sprite_habboclub_small"/>);
        }
    }

    return null;
}
