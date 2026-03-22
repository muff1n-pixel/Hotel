import { useDialogs } from "@UserInterface/Hooks/useDialogs";

export type UserLinkProps = {
    id: string;
    name: string;
};

export default function UserLink({ id, name }: UserLinkProps) {
    const dialogs = useDialogs();

    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
            pointerEvents: "auto"
        }} onClick={() => dialogs.addUniqueDialog("user-profile", id, id)}>
            <div>{name}</div>

            <div className="sprite_users_profile-small" style={{
                cursor: "pointer"
            }}/>
        </div>
    );
}
