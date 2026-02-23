import { ShopPageData } from "@Shared/Communications/Responses/Shop/ShopPagesEventData";
import DialogButton from "../../Dialog/Button/DialogButton";
import Dialog from "../../Dialog/Dialog";
import DialogContent from "../../Dialog/DialogContent";
import Input from "../../Form/Input";
import { useCallback, useState } from "react";
import { webSocketClient } from "../../../..";
import { UpdateShopBotEventData } from "@Shared/Communications/Requests/Shop/Development/UpdateShopBotEventData";
import { useDialogs } from "../../../hooks/useDialogs";
import { ShopPageBotData } from "@Shared/Communications/Responses/Shop/ShopPageBotsEventData";
import { BotTypeData } from "@Shared/Interfaces/Bots/BotTypeData";
import { FigureConfiguration } from "@Shared/Interfaces/Figure/FigureConfiguration";
import FigureImage from "../../Figure/FigureImage";
import { useUser } from "../../../hooks/useUser";

export type EditShopBotDialogProps = {
    data: Partial<ShopPageBotData> & {
        page: ShopPageData;
    };
    hidden?: boolean;
    onClose?: () => void;
}

export default function EditShopBotDialog({ hidden, data, onClose }: EditShopBotDialogProps) {
    const dialogs = useDialogs();
    const user = useUser();

    const [name, setName] = useState(data?.name ?? "");
    const [motto, setMotto] = useState(data?.name ?? "");

    const [type, setType] = useState<BotTypeData>(data?.type ?? "default");

    const [figureConfiguration, _setFigureConfiguration] = useState<FigureConfiguration>(data?.figureConfiguration ?? user.figureConfiguration);

    const [credits, setCredits] = useState(data?.credits ?? 0);
    const [duckets, setDuckets] = useState(data?.duckets ?? 0);
    const [diamonds, setDiamonds] = useState(data?.diamonds ?? 0);

    const handleUpdate = useCallback(() => {
        webSocketClient.send<UpdateShopBotEventData>("UpdateShopBotEvent", {
            id: data?.id ?? null,

            pageId: data.page.id,

            type,
            
            name,
            motto,

            figureConfiguration,

            credits,
            duckets,
            diamonds,
        });

        dialogs.closeDialog("edit-shop-bot");
    }, [dialogs, data, type, name, motto, figureConfiguration, credits, duckets, diamonds]);

    return (
        <Dialog title={(data?.id)?("Edit shop bot"):("Create shop bot")} hidden={hidden} onClose={onClose} width={320} height={580} initialPosition="center">
            <DialogContent>
                <div style={{
                    flex: "1 1 0",

                    overflowY: "scroll",

                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                }}>
                    <p style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 4,
                        alignItems: "center"
                    }}>
                        This bot {(data?.id)?("is"):("will be")} in the {(data.page.icon) && (<img src={`./assets/shop/icons/${data.page.icon}`}/>)} <b>{data.page.title}</b> page
                    </p>

                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <FigureImage figureConfiguration={figureConfiguration} direction={4}/>
                    </div>

                    <b>Bot type</b>

                    <Input placeholder="Bot type" value={type} onChange={(type) => setType(type as BotTypeData)}/>

                    <b>Bot name</b>

                    <Input placeholder="Bot name" value={name} onChange={setName}/>
                    
                    <b>Bot motto</b>

                    <Input placeholder="Bot motto" value={motto} onChange={setMotto}/>

                    <b>Bot price</b>

                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10
                    }}>
                        <div style={{
                            width: 20,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <div className="sprite_currencies_credits"/>
                        </div>

                        <div style={{ flex: 1 }}>
                            <Input type="number" placeholder="0" value={credits.toString()} onChange={(value) => setCredits(parseInt(value))}/>
                        </div>
                    </div>

                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10
                    }}>
                        <div style={{
                            width: 20,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <div className="sprite_currencies_duckets"/>
                        </div>

                        <div style={{ flex: 1 }}>
                            <Input type="number" placeholder="0" value={duckets.toString()} onChange={(value) => setDuckets(parseInt(value))}/>
                        </div>
                    </div>

                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10
                    }}>
                        <div style={{
                            width: 20,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <div className="sprite_currencies_diamonds"/>
                        </div>

                        <div style={{ flex: 1 }}>
                            <Input type="number" placeholder="0" value={diamonds.toString()} onChange={(value) => setDiamonds(parseInt(value))}/>
                        </div>
                    </div>

                    <div style={{
                        flex: 1
                    }}>

                    </div>

                    <div style={{
                        display: "flex",
                        justifyContent: "flex-end"
                    }}>
                        <DialogButton onClick={handleUpdate}>
                            {(data?.id)?("Update bot"):("Create bot")}
                        </DialogButton>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
