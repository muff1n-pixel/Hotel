export type DimmerDialogButtonProps = {
    label: string;
    onClick: () => void;
};

export default function DimmerDialogButton({ label, onClick }: DimmerDialogButtonProps) {
    return (
        <div style={{
            color: "#00ED1F",
            fontSize: 11,
            
            border: "2px solid #00AE17",
            borderRadius: 3,

            padding: "0 4px",

            height: 13,

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            cursor: "pointer",
        }} onClick={onClick}>
            <div>{label}</div>
        </div>
    );
}