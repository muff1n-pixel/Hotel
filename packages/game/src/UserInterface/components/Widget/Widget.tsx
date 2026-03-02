import { useDialogs } from "../../hooks/useDialogs";
import { useUser } from "../../hooks/useUser";
import WidgetButton from "./WidgetButton";
import WidgetCurrency from "./WidgetCurrency";
import WidgetItem from "./WidgetItem";


export default function Widget() {
    const user = useUser();
    const dialogs = useDialogs();

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
                    paddingLeft: 4,
                    paddingRight: 4,
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
                        <WidgetCurrency color="#37C8E9" value={user?.diamonds ?? 0}>
                            <div className="sprite_currencies_diamonds"/>
                        </WidgetCurrency>

                        <WidgetCurrency color="#CCA822" value={user?.credits ?? 0}>
                            <div className="sprite_currencies_credits"/>
                        </WidgetCurrency>

                        <WidgetCurrency color="#CE82CC" value={user?.duckets ?? 0}>
                            <div className="sprite_currencies_duckets"/>
                        </WidgetCurrency>
                    </div>
                    
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                        gap: 6,
                        width: 80
                    }}>
                        <WidgetItem>
                            <div className="sprite_currencies_club"/>

                            <b>Join</b>
                        </WidgetItem>

                        <WidgetItem>
                            <div className="sprite_currencies_earnings"/>

                            <b>Earnings</b>
                        </WidgetItem>
                    </div>

                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,

                        width: 50,
                    }}>
                        <WidgetButton color="#4D5FF2" onClick={() => {
                            window.open("/discord", "_blank")?.focus();
                        }}>
                            Discord
                        </WidgetButton>

                        <WidgetButton color="#716A85" onClick={() => {
                            dialogs.addUniqueDialog("settings");
                        }}>
                            <div className="sprite_widget_settings"/>
                        </WidgetButton>

                        <WidgetButton color="#DD5246" onClick={() => {
                            window.location.href = "/logout";
                        }}>
                            <div className="sprite_widget_logout"/>
                        </WidgetButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
