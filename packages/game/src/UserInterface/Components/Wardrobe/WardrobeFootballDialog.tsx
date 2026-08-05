import FigureWardrobeDialog from "./FigureWardrobeDialog";
import { webSocketClient } from "../../..";
import { useCallback, useState } from "react";
import { FigureConfigurationData, UpdateRoomFurnitureData } from "@pixel63/events";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";
import { useTranslation } from "react-i18next";
import WardrobeAvatar from "./WardrobeAvatar";
import { useRoomInstance } from "@UserInterface/Hooks/useRoomInstance";

export type WardrobeFootballDialogProps = {
    hidden?: boolean;
    data: {
        roomFurniture: RoomFurniture;
        gender: string;
    };
    onClose?: () => void;
};

export default function WardrobeFootballDialog(props: WardrobeFootballDialogProps) {
    const room = useRoomInstance();

    const [getWardrobeTranslation] = useTranslation("wardrobe");

    const [figureConfiguration, setFigureConfiguration] = useState<FigureConfigurationData | undefined>((props.data.roomFurniture.data.data?.common?.[(props.data.gender === "male")?("maleFigureConfiguration"):("femaleFigureConfiguration")]) ?? FigureConfigurationData.create({
        gender: props.data.gender,
        parts: [
            {
                type: "hd",
                setId: "180"
            }
        ]
    }));
   
    const handleFigureConfiguration = useCallback((figureConfiguration: FigureConfigurationData) => {
        setFigureConfiguration(figureConfiguration);
    }, [setFigureConfiguration]);

    const handleApply = useCallback(() => {
        if(!figureConfiguration) {
            return;
        }

        const filteredConfiguration = FigureConfigurationData.create({
            gender: figureConfiguration.gender,
            parts: figureConfiguration.parts
        });

        room?.websocket.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.fromJSON({
            id: props.data.roomFurniture.data.id,

            data: {
                common: {
                    [(props.data.gender === "male")?("maleFigureConfiguration"):("femaleFigureConfiguration")]: filteredConfiguration
                }
            }
        }));
    }, [figureConfiguration, room]);

    if(!figureConfiguration) {
        return null;
    }

    return (
        <FigureWardrobeDialog
            title={getWardrobeTranslation("subject_wardrobe", { subject: props.data.roomFurniture.furnitureData.name })}
            header={props.data.roomFurniture.furnitureData.name}
            figureConfiguration={figureConfiguration}
            onFigureConfigurationChange={handleFigureConfiguration}
            hiddenTabs={["generic", "head", "effects", "hotlooks", "wardrobe"]}
            {...props}>
            <div style={{
                flex: 1,

                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <div style={{
                    width: 130,
                    height: "100%"
                }}>
                    <WardrobeAvatar configuration={figureConfiguration}/>
                </div>

                <div style={{ width: "100%" }}>
                    <DialogButton onClick={handleApply}>{getWardrobeTranslation("save_my_looks")}</DialogButton>
                </div>
            </div>
        </FigureWardrobeDialog>
    );
}
