import { useCallback, useEffect, useState } from "react";
import { clientInstance } from "../..";
import { Logger } from "@pixel63/shared/Logger/Logger";

export function useDialogs() {
    const [_state, setState] = useState(clientInstance.dialogs.state);
    const [dialogs, setDialogs] = useState(clientInstance.dialogs.value ?? []);

    useEffect(() => {
        return clientInstance.dialogs.subscribe((dialogs) => {
            setDialogs(dialogs!);
            setState(clientInstance.dialogs.state);
        });
    }, []);

    const addDialog = useCallback((type: string, data: unknown) => {
        if (!dialogs) {
            return;
        }

        clientInstance.dialogs.value!.push({
            id: Math.random().toString(),
            data,
            type
        });

        clientInstance.dialogs.update();
    }, [dialogs]);

    const addUniqueDialog = useCallback((type: string, data: unknown = null, id: string = type) => {
        if (!dialogs) {
            return;
        }

        if (dialogs.some((dialog) => dialog.id === id)) {
            closeDialog(type);

            return;
        }

        clientInstance.dialogs.value!.push({
            id,
            data,
            type
        });

        clientInstance.dialogs.update();
    }, [dialogs]);

    const openUniqueDialog = useCallback((type: string, data: unknown = null) => {
        if (!dialogs) {
            return;
        }

        const existingIndex = dialogs.findIndex((dialog) => dialog.id === type);

        if (existingIndex !== -1) {
            clientInstance.dialogs.value![existingIndex].data = {
                ...clientInstance.dialogs.value![existingIndex].data ?? {},
                ...data ?? {}
            };
            clientInstance.dialogs.value![existingIndex].hidden = false;
        }
        else {
            clientInstance.dialogs.value!.push({
                id: type,
                data,
                type
            });
        }


        clientInstance.dialogs.update();
    }, [dialogs]);

    const setDialogHidden = useCallback((id: string, hidden: boolean) => {
        if (!dialogs) {
            return;
        }

        const index = dialogs.findIndex((dialog) => dialog.id === id);

        if (index === -1) {
            Logger.warn("Dialog does not exist", id);

            return;
        }

        clientInstance.dialogs.value![index].hidden = hidden;
        clientInstance.dialogs.update();
    }, [dialogs]);

    const closeDialog = useCallback((id: string) => {
        if (!dialogs) {
            return;
        }

        const index = dialogs.findIndex((dialog) => dialog.id === id);

        if (index === -1) {
            Logger.warn("Dialog does not exist", id);

            return;
        }

        clientInstance.dialogs.value!.splice(index, 1);
        clientInstance.dialogs.update();
    }, [dialogs]);

    return {
        dialogs,

        addDialog,
        addUniqueDialog,

        openUniqueDialog,

        setDialogHidden,

        closeDialog
    };
}
