import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import Input from "../../../Common/Form/Components/Input";
import { useCallback, useState } from "react";
import { webSocketClient } from "../../../..";
import { useDialogs } from "../../../Hooks/useDialogs";
import { DeleteHotelActivityRewardData, UpdateHotelActivityRewardData } from "@pixel63/events";
import { HotelActivityRewardData } from "@pixel63/events/build/Client/Hotel/ActivityRewards/HotelActivityRewardsData";

export type EditHotelActivityRewardDialogProps = {
    data: {
        activityReward?: HotelActivityRewardData;
    };
    hidden?: boolean;
    onClose?: () => void;
}

export default function EditHotelActivityRewardDialog({ hidden, data, onClose }: EditHotelActivityRewardDialogProps) {
    const dialogs = useDialogs();

    const [interval, setInterval] = useState(data?.activityReward?.interval ?? (60 * 5));

    const [credits, setCredits] = useState(data?.activityReward?.credits ?? 0);
    const [duckets, setDuckets] = useState(data?.activityReward?.duckets ?? 0);
    const [diamonds, setDiamonds] = useState(data?.activityReward?.diamonds ?? 0);

    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleUpdate = useCallback(() => {
        webSocketClient.sendProtobuff(UpdateHotelActivityRewardData, UpdateHotelActivityRewardData.create({
            id: data?.activityReward?.id,

            interval,

            credits,
            duckets,
            diamonds
        }));

        onClose?.();
    }, [dialogs, data, interval, credits, duckets, diamonds, onClose]);
    
    const handleDelete = useCallback(() => {
        if(!confirmDelete) {
            setConfirmDelete(true);

            return;
        }

        webSocketClient.sendProtobuff(DeleteHotelActivityRewardData, DeleteHotelActivityRewardData.create({
            id: data.activityReward?.id,
        }));

        onClose?.();
    }, [data, confirmDelete, onClose]);

    return (
        <Dialog title={(data?.activityReward?.id)?("Edit activity reward"):("Create activity reward")} editMode hidden={hidden} onClose={onClose} width={320} height={"auto"} assumedHeight={380} initialPosition="center">
            <DialogContent style={{
                gap: 8
            }}>
                <b>Interval (in seconds)</b>
                
                <p>The interval is counted by how long each user has been online and will reward the user for each interval span.</p>

                <Input type={"number"} placeholder="0" value={interval.toString()} onChange={(value) => setInterval(parseInt(value))}/>

                <p><i>Interval of {interval} seconds occurrs every {Math.round(interval / 60 * 100) / 100} minutes.</i></p>

                <div/>

                <b>Reward</b>

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

                <div style={{ flex: 1 }}/>

                <div style={{
                    display: "flex",
                    gap: 5
                }}>
                    {(data.activityReward?.id)?(
                        <DialogButton style={{ flex: 1 }} color="red" onClick={handleDelete}>
                            {(!confirmDelete)?("Delete furniture"):("Confirm deletion")}
                        </DialogButton>
                    ):(
                        <div style={{ flex: 1 }}/>
                    )}

                    <DialogButton style={{ flex: 1 }} onClick={handleUpdate}>
                        {(data?.activityReward?.id)?("Update reward"):("Create reward")}
                    </DialogButton>
                </div>
            </DialogContent>
        </Dialog>
    );
}
