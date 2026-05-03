export type MembershipIconProps = {
    membership: string;
}

export default function MembershipIcon({ membership }: MembershipIconProps) {
    switch(membership) {
        case "habboclub": {
            return (<div className="sprite_habboclub_wide"/>);
        }
    }

    return null;
}
