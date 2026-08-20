import { webSocketClient } from "../../../../..";
import { useRoomInstance } from "../../../../Hooks/useRoomInstance";
import { useUser } from "../../../../Hooks/useUser";
import { PickupRoomPetData, ScratchRoomPetData } from "@pixel63/events";
import { useTranslation } from "react-i18next";
import RoomPet from "@Client/Room/Pets/RoomPet";
import PetImage from "@UserInterface/Components/Pets/PetImage";
import PetExperienceProgressBar from "@UserInterface/Common/Pets/Components/PetExperienceProgressBar";
import PetHappinessProgressBar from "@UserInterface/Common/Pets/Components/PetHappinessProgressBar";
import PetEnergyProgressBar from "@UserInterface/Common/Pets/Components/PetEnergyProgressBar";
import UserLink from "@UserInterface/Common/Users/UserLink";

export type RoomPetProfileProps = {
    pet: RoomPet;
};

export default function RoomPetProfile({ pet }: RoomPetProfileProps) {
    const [getTranslation] = useTranslation("room");

    const user = useUser();

    const room = useRoomInstance();

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 10
        }}>
            <div style={{
                background: "rgba(61, 61, 61, .95)",
                padding: 10,
                borderRadius: 6,
                fontSize: 11,

                minWidth: 170,

                display: "flex",
                flexDirection: "column",
                gap: 10,

                pointerEvents: "auto"
            }}>

                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,

                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <b>{pet.data.name}</b>
                </div>

                <div style={{
                    width: "100%",
                    height: 1,
                    background: "#333333"
                }}/>

                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <PetImage data={pet.data.pet}/>
                </div>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 10
                }}>
                    <div>Level: {pet.data.level}/20</div>
                    <div>Age: {pet.data.days.toLocaleString('en-US')} days</div>
                </div>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 5,
                    paddingLeft: 10,
                    paddingRight: 10
                }}>
                    <PetHappinessProgressBar value={pet.data.happiness} maxValue={pet.data.maxHappiness}/>
                    <PetExperienceProgressBar value={pet.data.experience} maxValue={pet.data.maxExperience}/>
                    <PetEnergyProgressBar value={pet.data.energy} maxValue={pet.data.maxEnergy}/>
                </div>


                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 10
                }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 2,
                        height: 10
                    }}>
                        Been scratched: {pet.data.scratches.toLocaleString("en-US")} <div className="sprite_room_pet_scratches"/>    
                    </div>

                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 2,
                        height: 10
                    }}>
                        Owner: {pet.data.userName}
                    </div>
                </div>

            </div>

            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: 5
            }}>
                {(pet.data.userId && (room?.hasRights || pet.data.userId === user?.id)) && (
                    <div className="room-furniture-profile-button" onClick={() => {
                        room?.websocket.sendProtobuff(PickupRoomPetData, PickupRoomPetData.create({
                            id: pet.data.id
                        }));
                    }}>
                        {getTranslation("item.profile.pick_up")}
                    </div>
                )}
                
                {(user.scratches > 0) && (
                    <div className="room-furniture-profile-button" onClick={() => {
                        room?.websocket.sendProtobuff(ScratchRoomPetData, ScratchRoomPetData.create({
                            petId: pet.data.id
                        }));
                    }}>
                        {getTranslation("item.profile.scratch", { scratches: user.scratches })}
                    </div>
                )}
            </div>
        </div>
    );
}
