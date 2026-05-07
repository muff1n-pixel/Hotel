import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import { RoomFurnitureLogicDialogProps } from "../RoomFurnitureLogicDialog";
import Dialog from "@UserInterface/Common/Dialog/Dialog";
import DialogContent from "@UserInterface/Common/Dialog/Components/DialogContent";

export default function RoomFurnitureExternalImageDialog({ data, hidden, onClose }: RoomFurnitureLogicDialogProps) {
    if(hidden) {
        return null;
    }

    return (
        <Dialog title={data.furnitureData.name} onClose={onClose} width={340} height={380} initialPosition="center">
            <DialogContent>
                <FlexLayout flex={1} justify="center" align="center">
                    <img src={data.data.data?.externalImage?.externalImage}/>
                </FlexLayout>
            </DialogContent>
        </Dialog>
    );
}
