import { useCallback, useMemo } from "react";
import { RoomFurnitureLogicDialogProps } from "../RoomFurnitureLogicDialog";
import { webSocketClient } from "../../../../../..";
import { RoomInstanceFurniture } from "@Client/Room/RoomInstance";
import Dialog from "../../../../../Common/Dialog/Dialog";
import DialogContent from "../../../../../Common/Dialog/Components/DialogContent";
import DialogButton from "../../../../../Common/Dialog/Components/Button/DialogButton";
import { FigureConfigurationData, SetUserFigureConfigurationData } from "@pixel63/events";
import DialogHeaderContent from "@UserInterface/Common/Dialog/Components/DialogHeaderContent";
import DialogLink from "@UserInterface/Common/Dialog/Components/Link/DialogLink";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import FigureImage from "@UserInterface/Common/Figure/FigureImage";
import { useUser } from "@UserInterface/Hooks/useUser";
import FigureConfigurationHelper from "@pixel63/shared/Figure/FigureConfigurationHelper";

export type RoomFurnitureMannequinDialogData = {
    furniture: RoomInstanceFurniture;
    type: "furniture_clothing";
};

export default function RoomFurnitureMannequinDialog({ data, hidden, onClose }: RoomFurnitureLogicDialogProps) {
    const user = useUser();

    const figureConfiguration = useMemo(() => {
        if(!data.data.data?.mannequin?.figureConfiguration || !user.figureConfiguration) {
            return user.figureConfiguration ?? FigureConfigurationData.create({});
        }

        return FigureConfigurationHelper.replacePartsFromConfiguration(user.figureConfiguration, data.data.data?.mannequin?.figureConfiguration);
    }, [data.data.data?.mannequin?.figureConfiguration, user.figureConfiguration]);

    const handleBind = useCallback(() => {
        if(!figureConfiguration) {
            return;
        }

        onClose?.();

        webSocketClient.sendProtobuff(SetUserFigureConfigurationData, SetUserFigureConfigurationData.create({
            figureConfiguration
        }));
    }, [figureConfiguration, onClose]);

    if(hidden) {
        return null;
    }

    return (
        <Dialog title={data.furnitureData.name} hidden={hidden} onClose={onClose} initialPosition="center" width={420} height={"auto"} assumedHeight={270}>
            <DialogHeaderContent header={{
                backgroundColor: "#8899A2",

                icon: (
                    <FlexLayout justify="center" align="center" style={{
                        width: 90,
                        height: 120
                    }}>
                        <FigureImage figureConfiguration={figureConfiguration} direction={2}/>
                    </FlexLayout>
                ),

                title: data.furnitureData.name,
                description: (
                    <div>
                        {(data.furnitureData.description) && (
                            <p>{data.furnitureData.description}</p>
                        )}

                        <p style={{ marginTop: 20 }}><i>This is a permanent action. Once you equip it, your existing looks will be changed.</i></p>
                    </div>
                )
            }}/>

            <DialogContent style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <DialogLink onClick={onClose}>
                    Cancel
                </DialogLink>

                <DialogButton onClick={handleBind}>
                    Equip clothing
                </DialogButton>
            </DialogContent>
        </Dialog>
    );
}
