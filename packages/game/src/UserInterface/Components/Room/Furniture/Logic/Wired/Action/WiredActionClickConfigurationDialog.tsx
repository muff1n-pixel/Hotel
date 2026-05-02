import WiredDialog from "../../../../../../Common/Dialog/Layouts/Wired/WiredDialog";
import { RoomFurnitureLogicDialogProps } from "../../RoomFurnitureLogicDialog";
import WiredFurniture from "../../../../../../Common/Dialog/Layouts/Wired/WiredFurniture";
import WiredDivider from "../../../../../../Common/Dialog/Layouts/Wired/WiredDivider";
import WiredSection from "../../../../../../Common/Dialog/Layouts/Wired/WiredSection";
import { useCallback, useState } from "react";
import WiredButton from "../../../../../../Common/Dialog/Layouts/Wired/WiredButton";
import { webSocketClient } from "../../../../../../..";
import WiredDelay from "../../../../../../Common/Dialog/Layouts/Wired/WiredDelay";
import { UpdateRoomFurnitureData } from "@pixel63/events";
import { RoomClickFurnitureConfiguration, RoomClickUserConfiguration } from "@pixel63/events/build/Room/Configuration/RoomClickConfigurationData";
import WiredSelection from "@UserInterface/Common/Dialog/Layouts/Wired/Selection/WiredSelection";

export default function WiredActionClickConfigurationDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [userBehaviour, setUserBehaviour] = useState(data.data.data?.wiredActionClickConfiguration?.userBehaviour ?? RoomClickUserConfiguration.DEFAULT_USER_CLICK_BEHAVIOUR);
    const [furnitureBehaviour, setFurnitureBehaviour] = useState(data.data.data?.wiredActionClickConfiguration?.furnitureBehaviour ?? RoomClickFurnitureConfiguration.DEFAULT_FURNITURE_CLICK_BEHAVIOUR);

    const [delayInSeconds, setDelayInSeconds] = useState(data.data.data?.common?.delay?.delayInSeconds ?? 0);

    const handleApply = useCallback(() => {
        webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
            id: data.data.id,

            data: {
                common: {
                    delay: {
                        delayInSeconds
                    },
                },

                wiredActionClickConfiguration: {
                    userBehaviour,
                    furnitureBehaviour
                }
            }
        }));

        onClose();
    }, [userBehaviour, furnitureBehaviour, delayInSeconds, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>
            
            <WiredSection>
                <b>When clicking a user:</b>

                <WiredSelection value={userBehaviour} onChange={setUserBehaviour} items={[
                    {
                        value: RoomClickUserConfiguration.DEFAULT_USER_CLICK_BEHAVIOUR,
                        label: "Default"
                    },
                    {
                        value: RoomClickUserConfiguration.CLICKABLE_USER_BEHAVIOUR,
                        label: "Click the user, but walk behind the user"
                    },
                    {
                        value: RoomClickUserConfiguration.UNCLICKABLE_USER_BEHAVIOUR,
                        label: "Click passes through the user"
                    }
                ]}/>
            </WiredSection>

            <WiredDivider/>
            
            <WiredSection>
                <b>When clicking a furni:</b>

                <WiredSelection value={furnitureBehaviour} onChange={setFurnitureBehaviour} items={[
                    {
                        value: RoomClickFurnitureConfiguration.DEFAULT_FURNITURE_CLICK_BEHAVIOUR,
                        label: "Default"
                    },
                    {
                        value: RoomClickFurnitureConfiguration.UNCLICKABLE_FURNITURE_CLICK_BEHAVIOUR,
                        label: "Click passes through the furni"
                    },
                ]}/>
            </WiredSection>

            <WiredDivider/>

            <WiredDelay value={delayInSeconds} onChange={setDelayInSeconds}/>

            <WiredDivider/>

            <WiredSection style={{ flexDirection: "row" }}>
                <WiredButton onClick={handleApply}>Apply</WiredButton>
                <WiredButton onClick={onClose}>Cancel</WiredButton>
            </WiredSection>
        </WiredDialog>
    );
}
