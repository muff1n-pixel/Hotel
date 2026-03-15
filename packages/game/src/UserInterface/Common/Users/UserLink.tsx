export type UserLinkProps = {
    id: string;
    name: string;
};

export default function UserLink({ name }: UserLinkProps) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
            pointerEvents: "auto"
        }}>
            <div>{name}</div>

            <div className="sprite_users_profile-small" style={{
                cursor: "pointer"
            }}/>
        </div>
    );
}
