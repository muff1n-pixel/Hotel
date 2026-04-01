import FigureWardrobe from "@Client/Figure/Wardrobe/FigureWardrobe";
import { FurnitureData, SetUserFigureConfigurationData } from "@pixel63/events";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import DialogContent from "@UserInterface/Common/Dialog/Components/DialogContent";
import DialogHeaderContent from "@UserInterface/Common/Dialog/Components/DialogHeaderContent";
import DialogLink from "@UserInterface/Common/Dialog/Components/Link/DialogLink";
import DialogUnlocked from "@UserInterface/Common/Dialog/Components/Unlocked/DialogUnlocked";
import Dialog from "@UserInterface/Common/Dialog/Dialog";
import FurnitureImage from "@UserInterface/Components/Furniture/FurnitureImage";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { useUser } from "@UserInterface/Hooks/useUser";
import { webSocketClient } from "src";

export type ClothingUnlockedDialogProps = {
    hidden?: boolean;
    data: {
        furniture: FurnitureData;
        setIds: string[];
    };
    onClose?: () => void;
}

export default function ClothingUnlockedDialog({ hidden, data, onClose }: ClothingUnlockedDialogProps) {
    const user = useUser();
    const dialogs = useDialogs();

    if(!user) {
        return null;
    }

    return (
        <Dialog title="Wardrobe Clothing" hidden={hidden} onClose={onClose} initialPosition="center" width={420} height={"auto"} assumedHeight={270}>
            <DialogHeaderContent header={{
                backgroundColor: "#8899A2",

                icon: (
                    <DialogUnlocked>
                        <FurnitureImage furnitureData={data.furniture}/>
                    </DialogUnlocked>
                ),

                title: "You bought it.",
                description: (
                    <div>
                        <p>Now you have to wear it!</p>
                        <br/>
                        <p>You have received the '{data.furniture.name}' clothing item!</p>
                    </div>
                )
            }}/>

            <DialogContent style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <DialogLink onClick={() => {
                    onClose?.();
                    dialogs.openUniqueDialog("wardrobe");
                }}>
                    Open wardrobe
                </DialogLink>

                <DialogButton color="green" onClick={() => {
                    if(!user.figureConfiguration) {
                        return;
                    }

                    onClose?.();

                    webSocketClient.sendProtobuff(SetUserFigureConfigurationData, SetUserFigureConfigurationData.create({
                        figureConfiguration: FigureWardrobe.addSetsToFigure(user.figureConfiguration, data.setIds)
                    }));
                }}>
                    Equip clothing
                </DialogButton>
            </DialogContent>
        </Dialog>
    );
}
