import { useDialogs } from "@UserInterface/Hooks/useDialogs";

export type UserLinkProps = {
    id: string;
    name: string;
    reversed?: boolean;
};

export default function UserLink({ id, name, reversed }: UserLinkProps) {
    const dialogs = useDialogs();

    return (
        <div style={{
            width: "max-content",
            display: "flex",
            flexDirection: (reversed)?("row-reverse"):("row"),
            gap: 5,
            alignItems: "center",
            pointerEvents: "auto",
            cursor: "pointer"
        }} onClick={() => dialogs.addUniqueDialog("user-profile", id, id)}>
            <div>{name}</div>

            <div className="sprite_users_profile-small"/>
        </div>
    );
}
