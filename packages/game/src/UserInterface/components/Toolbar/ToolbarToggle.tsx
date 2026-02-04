export type ToolbarToggleProps = {
    toggled: boolean;
    onToggle: (toggled: boolean) => void;
};

export default function ToolbarToggle({ toggled, onToggle }: ToolbarToggleProps) {
    return (
        <div style={{
            display: "flex",

            height: "100%",
            width: 14,
            
            paddingTop: 1,
            paddingBottom: 1,
            boxSizing: "border-box",

            cursor: "pointer"
        }} onClick={() => onToggle(!toggled)}>
            <div style={{
                flex: 1,

                marginTop: 1,
                marginBottom: 1,
                
                backgroundColor: "#3A3832",
                
                display: "flex",
                justifyContent: "center",
                alignItems: "center",

                borderTopRightRadius: 5,
                borderBottomRightRadius: 5
            }}>
                <div className="sprite_toolbar_arrow" style={{
                    transform: (toggled)?("none"):("rotateZ(180deg)"),
                }}/>
            </div>
        </div>
    );
}
