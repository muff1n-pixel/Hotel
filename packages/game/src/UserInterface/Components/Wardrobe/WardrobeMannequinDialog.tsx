import FigureWardrobeDialog from "./FigureWardrobeDialog";
import { webSocketClient } from "../../..";
import { useCallback, useState } from "react";
import { FigureConfigurationData, UpdateRoomFurnitureData } from "@pixel63/events";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import RoomFurniture from "@Client/Room/Furniture/RoomFurniture";
import WardrobeMannequinAvatar from "@UserInterface/Components/Wardrobe/WardrobeMannequinAvatar";

export type WardrobeMannequinDialogProps = {
    hidden?: boolean;
    data: {
        roomFurniture: RoomFurniture;
    };
    onClose?: () => void;
};

export default function WardrobeMannequinDialog(props: WardrobeMannequinDialogProps) {
    const [figureConfiguration, setFigureConfiguration] = useState<FigureConfigurationData | undefined>(props.data.roomFurniture.data.data?.mannequin?.figureConfiguration ?? FigureConfigurationData.create({ gender: "male" }));
   
    const handleFigureConfiguration = useCallback((figureConfiguration: FigureConfigurationData) => {
        const filteredConfiguration = FigureConfigurationData.create({
            gender: figureConfiguration.gender,
            parts: figureConfiguration.parts.filter((part) => part.type !== 'hd')
        });

        console.log({filteredConfiguration});

        setFigureConfiguration(filteredConfiguration);
    }, [setFigureConfiguration]);

    const handleApply = useCallback(() => {
        webSocketClient.sendProtobuff(UpdateRoomFurnitureData, UpdateRoomFurnitureData.fromJSON({
            id: props.data.roomFurniture.data.id,

            data: {
                mannequin: {
                    figureConfiguration
                }
            }
        }));
    }, [figureConfiguration]);

    if(!figureConfiguration) {
        return null;
    }

    return (
        <FigureWardrobeDialog title="Mannequin Wardrobe" header={props.data.roomFurniture.furnitureData.name} figureConfiguration={figureConfiguration} onFigureConfigurationChange={handleFigureConfiguration} {...props}>
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
                    <WardrobeMannequinAvatar configuration={figureConfiguration} furnitureData={props.data.roomFurniture.furnitureData}/>
                </div>

                <div style={{ width: "100%" }}>
                    <DialogButton onClick={handleApply}>Save my looks</DialogButton>
                </div>
            </div>
        </FigureWardrobeDialog>
    );
}
