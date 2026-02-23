import { useCallback, useEffect, useRef, useState } from "react";
import DialogPanel from "../../Dialog/Panels/DialogPanel";
import { ShopPageProps } from "./ShopPage";
import DialogButton from "../../Dialog/Button/DialogButton";
import { webSocketClient } from "../../../..";
import { PurchaseShopBotEventData } from "@Shared/Communications/Requests/Shop/PurchaseShopBotEventData";
import { useDialogs } from "../../../hooks/useDialogs";
import { useUser } from "../../../hooks/useUser";
import useShopPageBots from "./Hooks/useShopPageBots";
import { ShopPageBotData } from "@Shared/Communications/Responses/Shop/ShopPageBotsEventData";
import FigureImage from "../../Figure/FigureImage";
import DialogCurrencyPanel from "../../Dialog/Panels/DialogCurrencyPanel";

export default function ShopBotsPage({ editMode, page }: ShopPageProps) {
    const dialogs = useDialogs();
    const user = useUser();

    const bots = useShopPageBots(page.id);

    const activeBotRef = useRef<HTMLCanvasElement>(null);

    const [activeBot, setActiveBot] = useState<ShopPageBotData>();

    useEffect(() => {
        if(!page.teaser) {
            setActiveBot(bots[0]);
        }
    }, [page, bots]);

    const handlePurchase = useCallback(() => {
        if(!activeBot) {
            return;
        }

        webSocketClient.send<PurchaseShopBotEventData>("PurchaseShopBotEvent", {
            shopBotId: activeBot.id
        });
    }, [activeBot, activeBotRef]);

    return (
        <div style={{
            flex: 1,

            display: "flex",
            flexDirection: "column",

            gap: 10,

            overflow: "hidden"
        }}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,

                height: 240,
                width: "100%",

                position: "relative"
            }}>
                {(activeBot) && (
                    <div style={{
                        flex: 1,

                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <FigureImage direction={4} figureConfiguration={activeBot.figureConfiguration}/>
                    </div>
                )}

                {(activeBot) && (
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,

                        justifyContent: "space-between"
                    }}>
                        <div>
                            <b>{activeBot.name}</b>

                            {(activeBot.motto) && (
                                <p style={{ fontSize: 12 }}>{activeBot.motto}</p>
                            )}
                        </div>

                        <div>
                            <DialogCurrencyPanel credits={activeBot.credits} duckets={activeBot.duckets} diamonds={activeBot.diamonds}/>
                        </div>
                    </div>
                )}

                {(!activeBot && page.teaser) && (
                    <div style={{
                        position: "absolute",

                        left: 0,
                        top: 0,

                        width: "100%",
                        height: "100%",

                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <img src={`./assets/shop/teasers/${page.teaser}`}/>
                    </div>
                )}
            </div>

            <DialogPanel style={{ flex: "1 1 0", overflow: "hidden" }} contentStyle={{ display: "flex", flex: 1 }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    
                    padding: 4,
                    overflowY: "scroll"
                }}>
                    {bots.map((bot) => (
                        <div key={bot.id} style={{
                            width: 53,
                            height: 62,
                            boxSizing: "border-box",

                            borderRadius: 5,

                            border: (activeBot?.id === bot.id)?("2px solid #62C4E8"):("2px solid transparent"),
                            background: (activeBot?.id === bot.id)?("#FFFFFF"):(undefined),

                            display: "flex",
                            justifyContent: "center",

                            cursor: "pointer"
                        }} onClick={() => (activeBot?.id !== bot.id) && setActiveBot(bot)}>
                            <div style={{
                                flex: 1,
                                alignSelf: "center",
                                justifySelf: "center",

                                position: "relative"
                            }}>
                                <div style={{ height: 30, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    <FigureImage headOnly direction={3} figureConfiguration={bot.figureConfiguration}/>
                                </div>

                                {(editMode) && (
                                    <div style={{
                                        position: "absolute",
                                        top: -10,
                                        right: -6,
                                        cursor: "pointer"
                                    }} onClick={() => dialogs.addUniqueDialog("edit-shop-bot", { ...bot, page: page })}>
                                        <div className="sprite_room_user_motto_pen"/>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {(editMode) && (
                        <div style={{
                            width: 53,
                            height: 62,

                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",

                            cursor: "pointer"
                        }} onClick={() => dialogs.addUniqueDialog("edit-shop-bot", { page })}>
                            <div className="sprite_add" style={{
                                marginTop: -8
                            }}/>
                        </div>
                    )}
                </div>
            </DialogPanel>

            <div style={{
                //height: 52,

                display: "flex",
                flexDirection: "column"
            }}>
                <div style={{ flex: 1 }}/>
                
                <div style={{
                    display: "flex",
                    flexDirection: "row"
                }}>
                    <div style={{ flex: 1 }}/>

                    <DialogButton disabled={!activeBot || (
                        (activeBot.credits ?? 0) > user.credits
                        || (activeBot.duckets ?? 0) > user.duckets
                        || (activeBot.diamonds ?? 0) > user.diamonds
                    )} style={{ flex: 1 }} onClick={handlePurchase}>Purchase</DialogButton>
                </div>
            </div>
        </div>
    );
}
