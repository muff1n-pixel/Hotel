export type DimmerDialogButtonProps = {
    label: string;
    onClick: () => void;
};

export default function DimmerDialogButton({ label, onClick }: DimmerDialogButtonProps) {
    return (
        <div style={{
            border: "2px solid #00AE17",
            borderRadius: 3,

            height: 13,

            display: "flex",
            justifyContent: "center",
            alignItems: "center",

            cursor: "pointer",
            
            fontSize: 11
        }} onClick={onClick}>
            <div>{label}</div>
        </div>
    );
}