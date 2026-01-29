import { useCallback, useEffect, useState } from "react";
import { clientInstance } from "../..";

export function useDialogs() {
  const [dialogs, setDialogs] = useState(clientInstance.dialogs.value ?? []);

  useEffect(() => {
    return clientInstance.dialogs.subscribe((dialogs) => {
        if(dialogs) {
            setDialogs(dialogs);
        }
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

    clientInstance.dialogs.value = dialogs.concat({
        id: type,
        data: null,
        type
    });
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

        const mutatedDialogs = [...dialogs];

        mutatedDialogs[index].hidden = hidden;

        clientInstance.dialogs.value = mutatedDialogs;
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

    clientInstance.dialogs.value = dialogs.filter((dialog) => dialog.id !== id);
  }, [dialogs]);

  return {
    dialogs,

    addUniqueDialog,
    setDialogHidden,
    closeDialog
  };
}
