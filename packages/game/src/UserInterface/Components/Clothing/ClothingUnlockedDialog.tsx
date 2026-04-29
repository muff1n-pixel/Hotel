import { FurnitureData } from "@pixel63/events";
import DialogButton from "@UserInterface/Common/Dialog/Components/Button/DialogButton";
import DialogContent from "@UserInterface/Common/Dialog/Components/DialogContent";
import DialogHeaderContent from "@UserInterface/Common/Dialog/Components/DialogHeaderContent";
import DialogLink from "@UserInterface/Common/Dialog/Components/Link/DialogLink";
import DialogUnlocked from "@UserInterface/Common/Dialog/Components/Unlocked/DialogUnlocked";
import Dialog from "@UserInterface/Common/Dialog/Dialog";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import FurnitureImage from "@UserInterface/Components2/Furniture/FurnitureImage";
import { useDialogs } from "@UserInterface/Hooks/useDialogs";
import { useUser } from "@UserInterface/Hooks/useUser";

export type ClothingUnlockedDialogProps = {
    hidden?: boolean;
    data: {
        furniture: FurnitureData;
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
        <Dialog title={data.furniture.name} hidden={hidden} onClose={onClose} initialPosition="center" width={420} height={"auto"} assumedHeight={270}>
            <DialogHeaderContent header={{
                backgroundColor: "#8899A2",

                icon: (
                    <DialogUnlocked>
                        {(data.furniture.interactionType === "fx_box" && data.furniture.customParams.length === 1)?(
                            <img src={`/assets/figure/effect_icons/icon_${data.furniture.customParams[0]}.png`}/>
                        ):(
                            <FurnitureImage furnitureData={data.furniture}/>
                        )}
                    </DialogUnlocked>
                ),

                title: "New wardrobe addition!",
                description: (
                    <FlexLayout direction="column">
                        <p>You have received the '{data.furniture.name}' clothing item!</p>

                        <p>Explore new looks with this item in your wardrobe.</p>
                    </FlexLayout>
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

                <DialogButton onClick={() => {
                    onClose?.();

                    dialogs.openUniqueDialog("wardrobe");
                }}>
                    Open wardrobe
                </DialogButton>
            </DialogContent>
        </Dialog>
    );
}
