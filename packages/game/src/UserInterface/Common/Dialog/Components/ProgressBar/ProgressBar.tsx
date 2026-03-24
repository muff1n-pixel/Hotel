export type ProgressBarProps = {
    value: number;
    maxValue: number;

    label?: string;
};

export default function ProgressBar({ label, value, maxValue }: ProgressBarProps) {
    return (
        <div style={{
            background: "#FFFFFF",
            
            border: "1px solid #000000",
            borderRadius: 6,
                
            width: 248,
            maxWidth: "100%",
            
            height: 17,
            
            padding: 2,

            display: "flex"
        }}>
            <div style={{
                flex: 1,

                borderRadius: 3,
                overflow: "hidden",

                background: "#5A534F",

                position: "relative"
            }}>
                <div style={{
                    width: `${(value / maxValue) * 100}%`,
                    height: "100%",

                    background: "linear-gradient(to bottom, #00B4C0 50%, #00A3AF 50%)",

                    border: "2px solid #00A2AE",

                    borderLeftWidth: (value > 0)?(1):(0),
                    borderRightWidth: (value > 0)?(1):(0),
                    borderRightColor: (value >= maxValue)?("#00A2AE"):("#000000"),

                    boxSizing: "border-box"
                }}/>

                {(label) && (
                    <div style={{
                        position: "absolute",

                        left: 0,
                        top: -1,

                        height: "100%",
                        width: "100%",

                        color: "#FFFFFF",
                        
                        fontFamily: "Ubuntu Bold",
                        fontSize: 13,

                        textAnchor: "middle",

                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        {label}
                    </div>
                )}
            </div>
        </div>
    );
}
