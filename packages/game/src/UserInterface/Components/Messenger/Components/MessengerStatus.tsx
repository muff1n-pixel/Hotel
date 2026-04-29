import { ReactNode } from "react";

export type MessengerStatusProps = {
    children?: ReactNode;
};

export default function MessengerStatus({ children }: MessengerStatusProps) {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            textAlign: "center",

            padding: 5,

            fontSize: 12
        }}>
            {children}
        </div>
    );
}
