import { useCallback, useEffect, useState } from "react";
import { clientInstance } from "../..";

export function useDialogs() {
  const [_state, setState] = useState(clientInstance.dialogs.state);
  const [dialogs, setDialogs] = useState(clientInstance.dialogs.value ?? []);

  useEffect(() => {
    return clientInstance.dialogs.subscribe((dialogs) => {
        setDialogs(dialogs!);
        setState(clientInstance.dialogs.state);
    });
  }, []);

  const addUniqueDialog = useCallback((type: string) => {
    if(!dialogs) {
      return;
    }

    if(dialogs.some((dialog) => dialog.id === type)) {
        closeDialog(type);
        
        return;
    }

    clientInstance.dialogs.value!.push({
        id: type,
        data: null,
        type
    });

    clientInstance.dialogs.update();
  }, [dialogs]);
  
    const setDialogHidden = useCallback((id: string, hidden: boolean) => {
        if(!dialogs) {
            return;
        }

        const index = dialogs.findIndex((dialog) => dialog.id === id);

        if(index === -1) {
            console.warn("Dialog does not exist", id);

            return;
        }

        clientInstance.dialogs.value![index].hidden = hidden;
        clientInstance.dialogs.update();
    }, [dialogs]);

  const closeDialog = useCallback((id: string) => {
    if(!dialogs) {
      return;
    }

    const index = dialogs.findIndex((dialog) => dialog.id === id);

    if(index === -1) {
        console.warn("Dialog does not exist", id);

        return;
    }

    clientInstance.dialogs.value!.splice(index, 1);
    clientInstance.dialogs.update();
  }, [dialogs]);

  return {
    dialogs,

    addUniqueDialog,
    setDialogHidden,
    closeDialog
  };
}
