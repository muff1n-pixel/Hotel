import { Fragment, useContext, useEffect } from "react";
import { AppContext, Dialog } from "../../contexts/AppContext";
import WardrobeDialog from "../Wardrobe/WardrobeDialog";
import ShopDialog from "../Shop/ShopDialog";
import InventoryDialog from "../Inventory/InventoryDialog";
import NavigatorDialog from "../Navigator/NavigatorDialog";
import RoomCreationDialog from "../Navigator/Rooms/Creator/RoomCreationDialog";
import { useDialogs } from "../../hooks/useDialogs";

export type DialogInstancesProps = {
    dialogs: Dialog[];
}

export default function DialogInstances({  }: DialogInstancesProps) {
    const { dialogs, closeDialog } = useDialogs();

    return (
        <Fragment>
            {dialogs.map((dialog) => {
                switch(dialog.type) {
                    case "wardrobe":
                        return (<WardrobeDialog key={dialog.id} hidden={dialog.hidden} onClose={() => closeDialog(dialog.id)}/>);
                        
                    case "shop":
                        return (<ShopDialog key={dialog.id} hidden={dialog.hidden} onClose={() => closeDialog(dialog.id)}/>);
                        
                    case "inventory":
                        return (<InventoryDialog key={dialog.id} hidden={dialog.hidden} onClose={() => closeDialog(dialog.id)}/>);
                        
                    case "navigator":
                        return (<NavigatorDialog key={dialog.id} hidden={dialog.hidden} onClose={() => closeDialog(dialog.id)}/>);
                        
                    case "room-creation":
                        return (<RoomCreationDialog key={dialog.id} hidden={dialog.hidden} onClose={() => closeDialog(dialog.id)}/>);
                }
            })}
        </Fragment>
    );
}
