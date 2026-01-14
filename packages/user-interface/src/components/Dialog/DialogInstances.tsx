import { Fragment, useContext, useEffect } from "react";
import { AppContext, Dialog } from "../../contexts/AppContext";
import WardrobeDialog from "../Wardrobe/WardrobeDialog";
import ShopDialog from "../Shop/ShopDialog";

export type DialogInstancesProps = {
    dialogs: Dialog[];
}

export default function DialogInstances({  }: DialogInstancesProps) {
    const { dialogs, closeDialog } = useContext(AppContext);

    return (
        <Fragment>
            {dialogs.map((dialog) => {
                switch(dialog.type) {
                    case "wardrobe":
                        return (<WardrobeDialog key={dialog.id} onClose={() => closeDialog(dialog.id)}/>);
                        
                    case "shop":
                        return (<ShopDialog key={dialog.id} onClose={() => closeDialog(dialog.id)}/>);
                }
            })}
        </Fragment>
    );
}
