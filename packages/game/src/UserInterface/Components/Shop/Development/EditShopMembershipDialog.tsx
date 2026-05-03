import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import Input from "../../../Common/Form/Components/Input";
import { useCallback, useState } from "react";
import { webSocketClient } from "../../../..";
import { useDialogs } from "../../../Hooks/useDialogs";
import { DeleteShopMembershipData, ShopMembershipData, ShopPageData, UpdateShopMembershipData } from "@pixel63/events";
import Selection from "@UserInterface/Common/Form/Components/Selection";

export type EditShopMembershipDialogProps = {
    data: {
        page: ShopPageData;
        membership?: Partial<ShopMembershipData>;
    };
    hidden?: boolean;
    onClose?: () => void;
}

export default function EditShopMembershipDialog({ hidden, data, onClose }: EditShopMembershipDialogProps) {
    const dialogs = useDialogs();

    const [membership, setMembership] = useState(data.membership?.membership ?? "habbo_club");
    const [days, setDays] = useState(data.membership?.days ?? 0);

    const [credits, setCredits] = useState(data.membership?.credits ?? 0);
    const [duckets, setDuckets] = useState(data.membership?.duckets ?? 0);
    const [diamonds, setDiamonds] = useState(data.membership?.diamonds ?? 0);

    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleUpdate = useCallback(() => {
        webSocketClient.sendProtobuff(UpdateShopMembershipData, UpdateShopMembershipData.create({
            id: data?.membership?.id,

            pageId: data.page.id,

            membership,
            days,

            credits,
            duckets,
            diamonds,
        }));

        dialogs.closeDialog("edit-shop-membership");
    }, [dialogs, data, membership, days, credits, duckets, diamonds]);

    const handleDelete = useCallback(() => {
        if(!confirmDelete) {
            setConfirmDelete(true);

            return;
        }

        webSocketClient.sendProtobuff(DeleteShopMembershipData, DeleteShopMembershipData.create({
            id: data.membership?.id,
        }));

        dialogs.closeDialog("edit-shop-membership");
    }, [data, confirmDelete]);

    return (
        <Dialog title={(data.membership?.id)?("Edit shop membership"):("Create shop membership")} hidden={hidden} onClose={onClose} width={320} height={"auto"} assumedHeight={580} initialPosition="center">
            <DialogContent style={{
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
                    This membership {(data.membership?.id)?("is"):("will be")} in the {(data.page.icon) && (<img src={`./assets/shop/icons/${data.page.icon}`}/>)} <b>{data.page.title}</b> page
                </p>

                <Selection value={membership} onChange={setMembership} items={[
                    {
                        value: "habboclub",
                        label: "Habbo Club"
                    }
                ]}/>

                <b>Membership days</b>

                <Input type="number" value={days.toString()} onChange={(value) => setDays(parseInt(value))}/>

                <b>Membership price</b>

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
                    gap: 5
                }}>
                    {(data.membership?.id)?(
                        <DialogButton style={{ flex: 1 }} color="red" onClick={handleDelete}>
                            {(!confirmDelete)?("Delete"):("Confirm deletion")}
                        </DialogButton>
                    ):(
                        <div style={{ flex: 1 }}/>
                    )}

                    <DialogButton style={{ flex: 1 }} onClick={handleUpdate}>
                        {(data.membership?.id)?("Update"):("Create")}
                    </DialogButton>
                </div>
            </DialogContent>
        </Dialog>
    );
}
