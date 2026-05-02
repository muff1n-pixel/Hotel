import WiredDialog from "../../../../../../Common/Dialog/Layouts/Wired/WiredDialog";
import { RoomFurnitureLogicDialogProps } from "../../RoomFurnitureLogicDialog";
import WiredFurniture from "../../../../../../Common/Dialog/Layouts/Wired/WiredFurniture";
import WiredDivider from "../../../../../../Common/Dialog/Layouts/Wired/WiredDivider";
import WiredSection from "../../../../../../Common/Dialog/Layouts/Wired/WiredSection";
import { useCallback, useState } from "react";
import WiredButton from "../../../../../../Common/Dialog/Layouts/Wired/WiredButton";
import { webSocketClient } from "../../../../../../..";
import WiredDelay from "../../../../../../Common/Dialog/Layouts/Wired/WiredDelay";
import { FigureConfigurationData, UpdateRoomFurnitureData } from "@pixel63/events";
import WiredInput from "@UserInterface/Common/Dialog/Layouts/Wired/WiredInput";
import WiredRadio from "@UserInterface/Common/Dialog/Layouts/Wired/WiredRadio";
import { useUser } from "@UserInterface/Hooks/useUser";
import FigureImage from "@UserInterface/Common/Figure/FigureImage";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";

export default function WiredActionBotChangeClothesDialog({ data, onClose }: RoomFurnitureLogicDialogProps) {
    const user = useUser();
    const dialogs = useDialogs();

    const [botName, setBotName] = useState(data.data.data?.wiredActionBotChangeClothes?.botName ?? "");
    const [figureConfiguration, setFigureConfiguration] = useState(data.data.data?.wiredActionBotChangeClothes?.figureConfiguration ?? user.figureConfiguration);

    const [delayInSeconds, setDelayInSeconds] = useState(data.data.data?.common?.delay?.delayInSeconds ?? 0);

    const handleApply = useCallback(() => {
        webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.create({
            id: data.data.id,

            data: {
                common: {
                    delay: {
                        delayInSeconds
                    }
                },

                wiredActionBotChangeClothes: {
                    botName,
                    figureConfiguration
                }
            }
        }));

        onClose();
    }, [botName, figureConfiguration, delayInSeconds, data, onClose]);

    return (
        <WiredDialog onClose={onClose}>
            <WiredFurniture furniture={data.furnitureData}/>

            <WiredDivider/>

            <WiredSection>
                <b>Bot Name</b>

                <WiredInput value={botName} onChange={setBotName}/>
            </WiredSection>

            <WiredDivider/>

            <WiredSection>
                <FlexLayout align="center" justify="center">
                    <FigureImage figureConfiguration={figureConfiguration} direction={3}/>
                </FlexLayout>

                <br/>

                <WiredButton onClick={() => {
                    dialogs.openUniqueDialog("wardrobe-common", {
                        figureConfiguration,
                        onApply: (figureConfiguration: FigureConfigurationData) => setFigureConfiguration(figureConfiguration)
                    });
                }}>
                    Open Bot Wardrobe
                </WiredButton>
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
