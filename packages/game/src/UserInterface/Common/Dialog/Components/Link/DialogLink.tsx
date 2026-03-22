import { PropsWithChildren } from "react";

export type DialogLinkProps = PropsWithChildren & {
    onClick?: () => void;
};

export default function DialogLink({ children, onClick }: DialogLinkProps) {
    return (
        <div style={{
            textDecoration: "underline",
            cursor: "pointer"
        }} onClick={onClick}>
            {children}
        </div>
    );
}
