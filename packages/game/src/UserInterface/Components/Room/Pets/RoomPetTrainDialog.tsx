import Dialog from "../../../Common/Dialog/Dialog";
import DialogContent from "../../../Common/Dialog/Components/DialogContent";
import RoomPet from "@Client/Room/Pets/RoomPet";
import DialogHeader from "@UserInterface/Common/Dialog/Components/DialogHeader";
import PetImage from "@UserInterface/Components/Pets/PetImage";
import PetEnergyProgressBar from "@UserInterface/Common/Pets/Components/PetEnergyProgressBar";
import PetHappinessProgressBar from "@UserInterface/Common/Pets/Components/PetHappinessProgressBar";
import PetExperienceProgressBar from "@UserInterface/Common/Pets/Components/PetExperienceProgressBar";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import { useCallback } from "react";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";
import { SendRoomChatMessageData } from "@pixel63/events";

export type RoomPetTrainDialogProps = {
    data: {
        pet: RoomPet;
    };
    hidden?: boolean;
    onClose?: () => void;
}

export default function RoomPetTrainDialog({ data, hidden, onClose }: RoomPetTrainDialogProps) {
    const { pet } = data;

    const roomInstance = useRoomInstance();

    const handleTrainCommand = useCallback((command: string) => {
        roomInstance?.websocket.sendProtobuff(SendRoomChatMessageData, SendRoomChatMessageData.create({
            message: `${pet.data.name} ${command}`
        }));
    }, [pet.data.name, roomInstance]);

    return (
        <Dialog title={pet.data.name} hidden={hidden} onClose={onClose} width={430} height={"auto"} assumedHeight={280}>
            
            <div style={{
                width: "100%",
               
                background: "#0E3F52",
                borderBottom: "1px solid black",
                boxSizing: "border-box",

                fontSize: 10,

                padding: "11px",

                gap: 30,

                display: "flex",
                flexDirection: "row",

                position: "relative"
            }}>
                <div style={{
                    aspectRatio: 1,

                    padding: "20px 40px",

                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",

                    flexDirection: "column",

                    gap: 10
                }}>
                    <PetImage data={pet.data.pet}/>

                    <div>Level {pet.data.level}/20</div>
                </div>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    
                    gap: 10,

                    flex: 1
                }}>
                    <PetEnergyProgressBar value={pet.data.energy} maxValue={pet.data.maxEnergy}/>
                    <PetHappinessProgressBar value={pet.data.happiness} maxValue={pet.data.maxHappiness}/>
                    <PetExperienceProgressBar value={pet.data.experience} maxValue={pet.data.maxExperience}/>
                </div>
            </div>

            <DialogContent style={{ gap: 10 }}>
                {[
                    {
                        level: 1,
                        commands: ["Sit", "Nest", "Eat", "Drink"]
                    },
                    
                    {
                        level: 2,
                        commands: ["Free", "Stay", "Stand"]
                    },
                    
                    {
                        level: 3,
                        commands: ["Jump", "Beg", "Lay"]
                    },
                    
                    {
                        level: 5,
                        commands: ["Play", "Play dead", "Play football"]
                    },
                    
                    {
                        level: 10,
                        commands: ["Move left", "Move right", "Move forward"]
                    },
                    
                    {
                        level: 15,
                        commands: ["Turn left", "Turn right", "Come here"]
                    },
                    
                    {
                        level: 20,
                        commands: ["Follow", "Follow left", "Follow right"]
                    },
                ].map((item) => (
                    <FlexLayout key={item.level} direction="column" gap={5}>
                        <b>Level {item.level}</b>

                        <FlexLayout direction="row" gap={5}>
                            {item.commands.map((command) => (
                                <DialogButton key={command} disabled={pet.data.level < item.level} style={{ flex: 1 }} onClick={() => handleTrainCommand(command.toLowerCase())}>{command}</DialogButton>
                            ))}
                        </FlexLayout>
                    </FlexLayout>
                ))}
            </DialogContent>
        </Dialog>
    );
}
