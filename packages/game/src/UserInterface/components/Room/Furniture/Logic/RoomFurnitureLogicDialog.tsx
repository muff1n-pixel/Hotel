import RoomFurnitureBackgroundDialog, { RoomFurnitureBackgroundDialogData } from "./Background/RoomFurnitureBackgroundDialog";
import RoomFurnitureDimmerDialog, { RoomFurnitureDimmerData } from "./Dimmer/RoomFurnitureDimmerDialog";
import RoomFurnitureStickiesDialog, { RoomFurnitureStickiesDialogData } from "./Stickies/RoomFurnitureStickiesDialog";
import RoomFurnitureBackgroundTonerDialog, { RoomFurnitureBackgroundTonerDialogData } from "./Toner/RoomFurnitureBackgroundTonerDialog";

export type RoomFurnitureLogicDialogProps = {
    data: RoomFurnitureLogicDialogData;
    hidden?: boolean;
    onClose: () => void;
}

export type RoomFurnitureLogicDialogData =
    RoomFurnitureDimmerData
    | RoomFurnitureBackgroundDialogData
    | RoomFurnitureBackgroundTonerDialogData
    | RoomFurnitureStickiesDialogData;

export default function RoomFurnitureLogicDialog(props: RoomFurnitureLogicDialogProps) {
    switch(props.data.type) {
        case "furniture_roomdimmer":
            return (<RoomFurnitureDimmerDialog {...props}/>);
            
        case "furniture_background":
            return (<RoomFurnitureBackgroundDialog {...props}/>);
            
        case "furniture_stickie":
            return (<RoomFurnitureStickiesDialog {...props}/>);
            
        case "furniture_background_color":
            return (<RoomFurnitureBackgroundTonerDialog {...props}/>)
    }

    return null;
}