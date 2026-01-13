import "./UserContextMenuButton.css";

export type UserContextMenuButtonProps = {
    text: string;
    onClick: () => void;
};

export default function UserContextMenuButton({ text, onClick }: UserContextMenuButtonProps) {
    return (
        <div className="button" style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            height: 26,

            cursor: "pointer",

            padding: "5px 12px",
            boxSizing: "border-box"
        }} onClick={onClick}>
            {text}
        </div>
    );
}
