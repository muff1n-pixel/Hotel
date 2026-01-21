import { useContext } from "react";
import { AppContext } from "../../contexts/AppContext";

function getCurrencyAsString(value?: number) {
    if(!value) {
        return "0";
    }

    if(value >= 1000000) {
        return `${Math.floor((value / 10000)) / 100} m`;
    }

    if(value >= 1000) {
        return `${Math.floor((value / 10)) / 100} k`;
    }

    return value.toString();
}

export default function Widget() {
    const { user } = useContext(AppContext);

    return (
        <div style={{
            position: "absolute",
            top: 0,
            right: 14
        }}>
            <div style={{
                border: "1px solid rgba(28, 28, 28, .75)",
                borderTop: "none",
                borderLeftWidth: 1,
                borderRightWidth: 1,

                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
            }}>
                <div style={{
                    border: "2px solid rgba(64, 64, 64, .75)",
                    borderTop: "none",
                    background: "rgba(28, 28, 26, .9)",

                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,

                    paddingTop: 2,
                    paddingBottom: 4,
                    boxSizing: "border-box",

                    width: 220,
                    height: 70,

                    gap: 10,

                    display: "flex",
                    flexDirection: "row"
                }}>
                    <div style={{
                        flex: 1,

                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                        alignItems: "flex-end"
                    }}>
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 5,
                            fontSize: 12,
                            color: "#37C8E9",
                            alignItems: "center"
                        }}>
                            <b>{getCurrencyAsString(user?.diamonds)}</b>

                            <div className="sprite_currencies_diamonds"/>
                        </div>

                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 5,
                            fontSize: 12,
                            color: "#CCA822",
                            alignItems: "center"
                        }}>
                            <b>{getCurrencyAsString(user?.credits)}</b>

                            <div className="sprite_currencies_credits"/>
                        </div>

                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 5,
                            fontSize: 12,
                            color: "#CE82CC",
                            alignItems: "center"
                        }}>
                            <b>{getCurrencyAsString(user?.duckets)}</b>

                            <div className="sprite_currencies_duckets"/>
                        </div>
                    </div>
                    
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                        gap: 6,
                        width: 80
                    }}>
                        <div style={{
                            flex: 1,
                            background: "rgba(64, 64, 64, .2)",
                            borderRadius: 10,
                            padding: "0 6px",
                            color: "#03B9BC",
                            display: "flex",
                            flexDirection: "row",
                            gap: 6,
                            fontSize: 12,
                            alignItems: "center",
                            lineHeight: 1
                        }}>
                            <div className="sprite_currencies_club"/>

                            <b>Join</b>
                        </div>
                        <div style={{
                            flex: 1,
                            background: "rgba(64, 64, 64, .2)",
                            borderRadius: 10,
                            padding: "0 6px",
                            color: "#03B9BC",
                            display: "flex",
                            flexDirection: "row",
                            gap: 6,
                            fontSize: 12,
                            alignItems: "center",
                            lineHeight: 1
                        }}>
                            <div className="sprite_currencies_earnings"/>

                            <b>Earnings</b>
                        </div>
                    </div>
                    
                    <div style={{ flex: 1 }}></div>
                </div>
            </div>
        </div>
    );
}
