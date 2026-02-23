import { FigureConfiguration } from "@Shared/Interfaces/Figure/FigureConfiguration";
import { useUser } from "../../hooks/useUser";
import FigureWardrobeDialog from "./FigureWardrobeDialog";
import { webSocketClient } from "../../..";
import { useCallback } from "react";
import { SetFigureConfigurationEventData } from "@Shared/Communications/Requests/User/SetFigureConfigurationEventData";

export type WardrobeDialogProps = {
    hidden?: boolean;
    onClose?: () => void;
};

export default function WardrobeDialog(props: WardrobeDialogProps) {
    const user = useUser();
    
    const handleApply = useCallback((figureConfiguration: FigureConfiguration) => {
        webSocketClient.send<SetFigureConfigurationEventData>("SetFigureConfigurationEvent", {
            figureConfiguration
        });
    }, []);

    return (
        <FigureWardrobeDialog title={user.name} initialFigureConfiguration={user.figureConfiguration} onApply={handleApply} {...props}/>
    );
}
