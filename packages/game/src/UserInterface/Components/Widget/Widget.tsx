import DateHelper from "@UserInterface/Utils/DateHelper";
import { useUser } from "../../Hooks/useUser";
import WidgetButton from "./WidgetButton";
import WidgetCurrency from "./WidgetCurrency";
import WidgetItem from "./WidgetItem";
import useShopPageLink from "@UserInterface/Components/Shop/Hooks/useShopPageLink";
import { useTranslation } from "react-i18next";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { useUserHabboClub } from "@UserInterface/Hooks/User/HabboClub/useUserHabboClub";
import { useEffect, useState } from "react";
import WidgetCurrencyChange from "./WidgetCurrencyChange";
import { webSocketClient } from "@Game/index";
import { UserData } from "@pixel63/events";

export type WidgetProps = {
    onSettingsClick?: () => void;
}

export type WidgetCurrencyChangeData = {
    state: number;
    value: number;
};

export default function Widget({ onSettingsClick }: WidgetProps) {
    const [getCurrencyTranslation] = useTranslation("currencies");
    const [getWidgetTranslation] = useTranslation("widget");

    const user = useUser();
    const userHabboClub = useUserHabboClub();

    const dialogs = useDialogs();

    const [creditsChange, setCreditsChange] = useState<WidgetCurrencyChangeData | undefined>(undefined);
    const [ducketsChange, setDucketsChange] = useState<WidgetCurrencyChangeData | undefined>(undefined);
    const [diamondsChange, setDiamondsChange] = useState<WidgetCurrencyChangeData | undefined>(undefined);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(UserData, {
            async handle(payload: UserData) {
                if(user.credits !== payload.credits) {
                    setCreditsChange({
                        state: Math.random(),
                        value: payload.credits - user.credits
                    });
                }

                if(user.duckets !== payload.duckets) {
                    setDucketsChange({
                        state: Math.random(),
                        value: payload.duckets - user.duckets
                    });
                }

                if(user.diamonds !== payload.diamonds) {
                    setDiamondsChange({
                        state: Math.random(),
                        value: payload.diamonds - user.diamonds
                    });
                }
            },
        });

        return () => {
            webSocketClient.removeProtobuffListener(UserData, listener);
        };
    }, [user]);

    return (
        <div style={{
            border: "1px solid rgba(0, 0, 0, 0.64)",
            borderTop: "none",
            borderLeftWidth: 1,
            borderRightWidth: 1,

            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
        }}>
            <div style={{
                border: "2px solid rgba(102, 100, 94, 0.64)",
                borderTop: "none",
                background: "rgba(44, 42, 41, 0.64)",

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
                justifyContent: "space-between",
                flexDirection: "row"
            }}>
                <div style={{
                    flex: 1,

                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    alignItems: "flex-end"
                }}>
                    <WidgetCurrency color="#37C8E9" value={user?.diamonds ?? 0} tooltip={getCurrencyTranslation("diamonds")}>
                        <div className="sprite_currencies_diamonds"/>

                        {(diamondsChange) && (
                            <WidgetCurrencyChange key={diamondsChange.state} data={diamondsChange} color="#37C8E9" tooltip={getCurrencyTranslation("diamonds")} onFinish={() => setDiamondsChange(undefined)}>
                                <div className="sprite_currencies_diamonds"/>
                            </WidgetCurrencyChange>
                        )}
                    </WidgetCurrency>

                    <WidgetCurrency color="#CCA822" value={user?.credits ?? 0} tooltip={getCurrencyTranslation("credits")}>
                        <div className="sprite_currencies_credits"/>

                        {(creditsChange) && (
                            <WidgetCurrencyChange key={creditsChange.state} data={creditsChange} color="#CCA822" tooltip={getCurrencyTranslation("credits")} onFinish={() => setCreditsChange(undefined)}>
                                <div className="sprite_currencies_credits"/>
                            </WidgetCurrencyChange>
                        )}
                    </WidgetCurrency>

                    <WidgetCurrency color="#CE82CC" value={user?.duckets ?? 0} tooltip={getCurrencyTranslation("duckets")}>
                        <div className="sprite_currencies_duckets"/>

                        {(ducketsChange) && (
                            <WidgetCurrencyChange key={ducketsChange.state} data={ducketsChange} color="#CE82CC" tooltip={getCurrencyTranslation("duckets")} onFinish={() => setDucketsChange(undefined)}>
                                <div className="sprite_currencies_duckets"/>
                            </WidgetCurrencyChange>
                        )}
                    </WidgetCurrency>
                </div>
                
                <div style={{
                    flex: 1,

                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    gap: 6,
                    width: 50
                }}>
                    <WidgetItem style={{ flexDirection: "column" }} onClick={() => {
                        dialogs.openUniqueDialog("habbo-club-center");
                    }}>
                        <div className="sprite_currencies_club"/>

                        {(userHabboClub?.active)?(
                            <b>{DateHelper.getFormattedTimeUntilDate(userHabboClub.expiresAt)}</b>
                        ):(
                            <b>{getWidgetTranslation("join")}</b>
                        )}
                    </WidgetItem>

                    {/*<WidgetItem>
                        <div className="sprite_currencies_earnings"/>

                        <b>{getWidgetTranslation("earnings")}</b>
                    </WidgetItem>*/}
                </div>

                <div style={{
                    height: "100%",
                    width: 1,

                    background: "rgba(102, 100, 94, 0.64)"
                }}/>

                <div style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,

                    width: 50,
                }}>
                    <WidgetButton tooltip={getWidgetTranslation("discord")} color="#4D5FF2" onClick={() => {
                        window.open("/discord", "_blank")?.focus();
                    }}>
                        {getWidgetTranslation("discord")}
                    </WidgetButton>

                    <WidgetButton tooltip={getWidgetTranslation("settings.title")} color="#716A85" onClick={() => {
                        onSettingsClick?.();
                    }}>
                        <div className="sprite_widget_settings"/>
                    </WidgetButton>

                    <WidgetButton tooltip={getWidgetTranslation("log_out")} color="#DD5246" onClick={() => {
                        window.location.href = "/logout";
                    }}>
                        <div className="sprite_widget_logout"/>
                    </WidgetButton>
                </div>
            </div>
        </div>
    );
}
