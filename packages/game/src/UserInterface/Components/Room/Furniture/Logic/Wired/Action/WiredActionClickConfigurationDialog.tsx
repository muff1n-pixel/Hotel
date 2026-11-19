import { useTranslation } from "react-i18next";
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
import WiredSelection from "@UserInterface/Common/Dialog/Layouts/Wired/Selection/WiredSelection";
import { RoomClickFurnitureConfiguration, RoomClickUserConfiguration } from "@pixel63/events/build/Client/Room/Configuration/RoomClickConfigurationData";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";

export default function WiredActionClickConfigurationDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const [getTranslation] = useTranslation("wired");
    const room = useRoomInstance();

    const [userBehaviour, setUserBehaviour] = useState(data.data.data?.wiredActionClickConfiguration?.userBehaviour ?? RoomClickUserConfiguration.DEFAULT_USER_CLICK_BEHAVIOUR);
    const [furnitureBehaviour, setFurnitureBehaviour] = useState(data.data.data?.wiredActionClickConfiguration?.furnitureBehaviour ?? RoomClickFurnitureConfiguration.DEFAULT_FURNITURE_CLICK_BEHAVIOUR);

    const [delayInSeconds, setDelayInSeconds] = useState(data.data.data?.common?.delay?.delayInSeconds ?? 0);

    const handleApply = useCallback(() => {
        room?.websocket.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
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
    }, [userBehaviour, furnitureBehaviour, delayInSeconds, data, onClose, room]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>
            
            <WiredSection>
                <b>{getTranslation("creator.when_clicking_user")}</b>

                <WiredSelection value={userBehaviour} onChange={setUserBehaviour} items={[
                    {
                        value: RoomClickUserConfiguration.DEFAULT_USER_CLICK_BEHAVIOUR,
                        label: getTranslation("creator.default")
                    },
                    {
                        value: RoomClickUserConfiguration.CLICKABLE_USER_BEHAVIOUR,
                        label: getTranslation("creator.click_user_walk_behind")
                    },
                    {
                        value: RoomClickUserConfiguration.UNCLICKABLE_USER_BEHAVIOUR,
                        label: getTranslation("creator.click_through_user")
                    }
                ]}/>
            </WiredSection>

            <WiredDivider/>
            
            <WiredSection>
                <b>{getTranslation("creator.when_clicking_furni")}</b>

                <WiredSelection value={furnitureBehaviour} onChange={setFurnitureBehaviour} items={[
                    {
                        value: RoomClickFurnitureConfiguration.DEFAULT_FURNITURE_CLICK_BEHAVIOUR,
                        label: getTranslation("creator.default")
                    },
                    {
                        value: RoomClickFurnitureConfiguration.UNCLICKABLE_FURNITURE_CLICK_BEHAVIOUR,
                        label: getTranslation("creator.click_through_furni")
                    },
                ]}/>
            </WiredSection>

            <WiredDivider/>

            <WiredDelay value={delayInSeconds} onChange={setDelayInSeconds}/>

            <WiredDivider/>

            <WiredSection style={{ flexDirection: "row" }}>
                <WiredButton onClick={handleApply}>{getTranslation("creator.apply")}</WiredButton>
                <WiredButton onClick={onClose}>{getTranslation("creator.cancel")}</WiredButton>
            </WiredSection>
        </WiredDialog>
    );
}
