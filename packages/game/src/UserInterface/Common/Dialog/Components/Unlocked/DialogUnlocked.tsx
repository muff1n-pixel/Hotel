import { ReactNode } from "react";

export type DialogUnlockedProps = {
    children?: ReactNode;
}

export default function DialogUnlocked({ children }: DialogUnlockedProps) {
    return (
        <div className="sprite_dialog_unlocked" style={{
            overflow: "hidden",

            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            {children}
        </div>
    );
}
