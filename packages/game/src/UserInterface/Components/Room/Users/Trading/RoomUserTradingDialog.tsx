import { webSocketClient } from "@Game/index";
import { UpdateRoomUserTradingData } from "@pixel63/events";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import DialogTabs from "@UserInterface/Common/Dialog/Components/Tabs/DialogTabs";
import Dialog from "@UserInterface/Common/Dialog/Dialog";
import Input from "@UserInterface/Common/Form/Components/Input";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import InventoryFurnitureTab from "@UserInterface/Components/Inventory/Tabs/InventoryFurnitureTab";
import TradingPanel from "@UserInterface/Components/Room/Users/Trading/Components/TradingPanel";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";
import { useRoomUserTrading } from "@UserInterface/Hooks/useRoomUserTrading";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type RoomUserTradingDialogProps = {
    hidden?: boolean;
    onClose: () => void;
};

export default function RoomUserTradingDialog({ hidden, onClose }: RoomUserTradingDialogProps) {
    const room = useRoomInstance();
    const trading = useRoomUserTrading();

    const timer = useRef<NodeJS.Timeout>(null);

    const [quantity, setQuantity] = useState(1);
    const [secondsUntilCompletion, setSecondsUntilCompletion] = useState<number>();

    const tradingUser = useMemo(() => {
        if(!trading) {
            return null;
        }

        if(!room) {
            return null;
        }

        return room.users.find((user) => user.data.id === trading.userId) ?? null;
    }, [room, trading?.userId]);

    useEffect(() => {
        if(!trading?.completesAt) {
            if(timer.current !== null) {
                clearInterval(timer.current);
                timer.current = null;
            }

            return;
        }

        timer.current = setInterval(() => {
            if(!trading.completesAt) {
                return;
            }

            const date = new Date();
            const completesAt = new Date(trading.completesAt);

            setSecondsUntilCompletion((completesAt.getTime() - date.getTime()) / 1000);

            if(date.getTime() >= completesAt.getTime()) {
                if(timer.current !== null) {
                    clearInterval(timer.current);
                    timer.current = null;
                }
            }
        }, 100);

        return () => {
            if(timer.current !== null) {
                clearInterval(timer.current);
                timer.current = null;
            }
        };
    }, [trading?.completesAt]);

    const handleClose = useCallback(() => {
        if(!trading) {
            onClose?.();

            return;
        }

        webSocketClient.sendProtobuff(UpdateRoomUserTradingData, UpdateRoomUserTradingData.create({
            userId: trading.userId,

            cancel: true
        }));

        onClose?.();
    }, [trading, onClose]);

    if(!trading || !tradingUser) {
        return null;
    }

    return (
        <Dialog title={`Trading with ${tradingUser.data.name}`} width={500} height={590} hidden={hidden} onClose={handleClose}>
            <DialogTabs withoutHeader tabs={[
                {
                    icon: "Furniture",
                    element: (
                        <InventoryFurnitureTab trading={true} allowPlacingInRoom={false} button={(activeFurniture) => (
                            <FlexLayout direction="row">
                                <Input key={activeFurniture?.id} type="number" min={1} max={activeFurniture?.quantity} value={Math.min(quantity, activeFurniture?.quantity ?? 1).toString()} onChange={(value) => setQuantity(Math.min(parseInt(value), activeFurniture?.quantity ?? 1))} style={{
                                    width: 30
                                }}/>

                                <DialogButton disabled={!activeFurniture || trading.completesAt !== undefined} style={{
                                    width: "100%"
                                }} onClick={() => {
                                    if(!activeFurniture) {
                                        return;
                                    }

                                    webSocketClient.sendProtobuff(UpdateRoomUserTradingData, UpdateRoomUserTradingData.create({
                                        userId: tradingUser.data.id,

                                        addUserFurnitureId: activeFurniture.id,
                                        addUserFurnitureQuantity: Math.min(quantity, activeFurniture?.quantity ?? 1)
                                    }));
                                }}>
                                    Offer
                                </DialogButton>
                            </FlexLayout>
                        )}/>
                    )
                },
            ]}/>

            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                padding: "0px 6px 6px",
                height: 250
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,

                    background: "#E2E2E2",
                    border: "1px solid #C0C0C0",
                    borderRadius: 6,

                    color: "#000000",

                    fontSize: 13,

                    padding: 6,

                    position: "relative"
                }}>
                    Add the items you would like to trade in the box below.

                    <FlexLayout direction="row">
                        <FlexLayout direction="column" align="center" style={{ flex: 1 }}>
                            <TradingPanel userFurniture={trading.givingUserFurniture} locked={trading.givingLocked} onDelete={(userFurniture) => {
                                webSocketClient.sendProtobuff(UpdateRoomUserTradingData, UpdateRoomUserTradingData.create({
                                    userId: tradingUser.data.id,

                                    removeUserFurnitureId: userFurniture.id,
                                }));
                            }}/>
                        </FlexLayout>

                        <div style={{
                            width: 1,
                            height: "100%",

                            borderLeft: "1px solid #B4B4B4",
                            borderRadius: "1px solid #F3F3F3"
                        }}/>
                        
                        <FlexLayout direction="column" align="center" style={{ flex: 1 }}>
                            <TradingPanel user={tradingUser.data} userFurniture={trading.receivingUserFurniture} locked={trading.receivingLocked}/>
                        </FlexLayout>
                    </FlexLayout>

                    {(trading.completesAt) && (
                        <div style={{
                            position: "absolute",

                            left: 0,
                            top: 0,

                            width: "100%",
                            height: "100%",

                            background: "rgba(128, 0, 0, .2)",
                            borderRadius: 6,

                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",

                            fontFamily: "Ubuntu Bold",
                            fontSize: 14
                        }}>
                            {Math.round(Math.max(secondsUntilCompletion ?? 5, 0) * 10) / 10} seconds until completion
                        </div>
                    )}
                </div>

                <FlexLayout direction="row" justify="space-between">
                    <DialogButton disabled={trading.givingLocked} onClick={() => {
                        webSocketClient.sendProtobuff(UpdateRoomUserTradingData, UpdateRoomUserTradingData.create({
                            userId: tradingUser.data.id,

                            lock: true
                        }));
                    }}>
                        Lock trade
                    </DialogButton>

                    <DialogButton onClick={handleClose}>Cancel</DialogButton>
                </FlexLayout>
            </div>
        </Dialog>
    );
}
