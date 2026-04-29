import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import FurnitureImage from "../FurnitureImage";
import { useCallback, useEffect, useMemo, useState } from "react";
import Input from "../../../Common/Form/Components/Input";
import DialogButton from "../../../Common/Dialog/Components/Button/DialogButton";
import { FurnitureCrackableData, FurnitureCrackableRewardData, FurnitureData, GetFurnitureCrackableData, UpdateFurnitureCrackableData } from "@pixel63/events";
import DialogTable from "@UserInterface/Common/Dialog/Components/Table/DialogTable";
import FurnitureIcon from "@UserInterface/Components2/Furniture/FurnitureIcon";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import { webSocketClient } from "@Game/index";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";

export type EditFurnitureCrackableDialogProps = {
    hidden?: boolean;
    data: {
        furniture: FurnitureData;
    };
    onClose?: () => void;
}

export default function EditFurnitureCrackableDialog({ hidden, data, onClose }: EditFurnitureCrackableDialogProps) {
    const dialogs = useDialogs();

    const [requiredClicks, setRequiredClicks] = useState<number>(0);
    const [rewards, setRewards] = useState<FurnitureCrackableRewardData[]>([]);

    const rewardChances = useMemo(() => {
        const total = rewards.reduce((sum, reward) => sum + reward.chance, 0);

        return rewards.map((reward) => {
            if(reward.chance === 0) {
                return 0;
            }

            return (reward.chance / total) * 100;
        });
    }, [rewards]);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(FurnitureCrackableData, {
            async handle(payload: FurnitureCrackableData) {
                setRequiredClicks(payload.requiredClicks);
                setRewards(payload.rewards);
            },
        });

        webSocketClient.sendProtobuff(GetFurnitureCrackableData, GetFurnitureCrackableData.create({
            furnitureId: data.furniture.id
        }));

        return () => {
            webSocketClient.removeProtobuffListener(FurnitureCrackableData, listener);
        };
    }, [data.furniture.id]);

    const handleSubmit = useCallback(() => {
        webSocketClient.sendProtobuff(UpdateFurnitureCrackableData, UpdateFurnitureCrackableData.create({
            furnitureId: data.furniture.id,
            crackable: {
                requiredClicks,
                rewards
            }
        }));

        dialogs.closeDialog("edit-furniture-crackable");
    }, [requiredClicks, rewards]);

    return (
        <Dialog title="Furniture Crackable Editor" hidden={hidden} onClose={onClose} initialPosition="center" width={720} height={420} style={{
            overflow: "visible"
        }}>
            <DialogContent>
                <div style={{
                    flex: 1,
                    
                    display: "flex",
                    flexDirection: "row",
                    gap: 20
                }}>
                    <div style={{
                        flex: 2,

                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",

                        overflow: "hidden"
                    }}>
                        <div style={{
                            flex: 1,

                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <FurnitureImage furnitureData={data.furniture}/>
                        </div>

                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 10,
                            
                            width: "100%"
                        }}>
                            <b>{data.furniture.name}</b>

                            <p>{data.furniture.description}</p>
                        </div>
                    </div>

                    <div style={{
                        flex: 3,

                        display: "flex",
                        flexDirection: "column",
                        gap: 10
                    }}>
                        <b>Required clicks</b>

                        <Input type="number" value={requiredClicks.toString()} onChange={(value) => setRequiredClicks(parseInt(value))}/>

                        <b>Furniture rewards</b>

                        <DialogTable
                            columns={["Furniture", "Chance"]}
                            items={rewards.map((reward, index) => {
                                return {
                                    id: reward.id,
                                    values: [
                                        (
                                            <FlexLayout direction="row" align="center">
                                                <FurnitureIcon furnitureData={reward.furniture}/>

                                                {reward.furniture?.name}
                                            </FlexLayout>
                                        ),
                                        `${rewardChances[index]}%`
                                    ],
                                    tools: (
                                        <div>
                                            <div
                                                className="sprite_add"
                                                style={{
                                                    cursor: "pointer"
                                                }}
                                                onClick={() => {
                                                    const mutatedRewards = [...rewards];
                                                    mutatedRewards[index].chance++;

                                                    setRewards(mutatedRewards);
                                                }}/>

                                            <div
                                                className="sprite_sub"
                                                style={{
                                                    cursor: "pointer"
                                                }}
                                                onClick={() => {
                                                    const mutatedRewards = [...rewards];
                                                    mutatedRewards[index].chance = Math.max(0, mutatedRewards[index].chance - 1);

                                                    setRewards(mutatedRewards);
                                                }}/>
                                        </div>
                                    )
                                }; 
                            })}
                            tools={(
                                <div
                                    className="sprite_add"
                                    style={{
                                        cursor: "pointer"
                                    }}
                                    onClick={() => {
                                        dialogs.addUniqueDialog("furniture-browser", {
                                            onSelect: (furniture: FurnitureData) => {
                                                const mutatedRewards = [...rewards];
                                                mutatedRewards.push(FurnitureCrackableRewardData.create({
                                                    id: Math.random().toString(),
                                                    furniture,
                                                    chance: 0
                                                }));

                                                setRewards(mutatedRewards);
                                            }
                                        })
                                    }}/>
                            )}/>

                        <div style={{ alignSelf: "flex-end"}}>
                            <DialogButton onClick={handleSubmit}>Update clickable data</DialogButton>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
