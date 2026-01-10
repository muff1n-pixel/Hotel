import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { AppContext, Dialog, TypedEventTarget } from "../contexts/AppContext";
import Toolbar from "./Toolbar/Toolbar";
import WardrobeDialog from "./Wardrobe/WardrobeDialog";

export type InterfaceInstanceProps = {
    internalEventTarget: TypedEventTarget;
}

export default function InterfaceInstance({ internalEventTarget }: InterfaceInstanceProps) {
    const [dialogs, setDialogs] = useState<Dialog[]>([
        /*{
            name: "wardrobe",
            element: (<WardrobeDialog/>)
        }*/
    ]);

    useEffect(() => {
        const listener = (event: Event) => {
            //console.log("Received client ping in interface instance.", event);
        };

        internalEventTarget.addEventListener("client", listener);

        internalEventTarget.dispatchEvent(new Event("interface"));

        return () => internalEventTarget.removeEventListener("client", listener);
    }, []);

    const addUniqueDialog = useCallback((dialog: Dialog) => {
        if(dialogs.some((existingDialog) => existingDialog.name === dialog.name)) {
            return;
        }

        setDialogs(dialogs.concat([ dialog ]));
    }, [dialogs, setDialogs]);

    return (
        <AppContext value={{
            dialogs,
            addUniqueDialog,
            internalEventTarget
        }}>
            {dialogs.map((dialog) => (
                <Fragment key={dialog.name}>
                    {dialog.element}
                </Fragment>
            ))}

            <Toolbar/>
        </AppContext>
    );
}