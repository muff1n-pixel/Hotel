import ToolbarFigureItem from "./Items/ToolbarFigureItem";

export default function Toolbar() {
    return (
        <div style={{
            position: "absolute",
            
            left: 0,
            bottom: 0,

            width: "100%",
            height: 47,

            background: "rgba(28, 28, 26, .9)",

            borderTop: "2px solid rgba(64, 64, 64, .75)",
            borderBottom: "1px solid rgba(64, 64, 64, .75)",
            
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",

            pointerEvents: "auto"
        }}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: 14,
                alignItems: "center"
            }}>
                <div/>

                <div style={{
                    width: 28,
                    height: 28,

                    background: "url(/assets/images/toolbar/logo.png)"
                }}>
                </div>

                <ToolbarFigureItem/>
            </div>
        </div>
    );
}
