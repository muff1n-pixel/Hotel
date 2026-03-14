import { FigureConfigurationData } from "@pixel63/events";
import FigureImage from "src/UserInterface/Common/Figure/FigureImage";

export type MessengerFigureProps = {
    figureConfiguration?: FigureConfigurationData;
    onClose?: () => void;
};

export default function MessengerFigure({ figureConfiguration, onClose }: MessengerFigureProps) {
    return (
        <div style={{
            width: 50,
            height: 50,

            borderRadius: "100%",

            background: "rgba(0, 0, 0, .1)",
            border: "2px solid rgba(0, 0, 0, .1)",

            cursor: "pointer",

            position: "relative"
        }}>
            <div style={{
                width: 50,
                height: 50,

                borderRadius: "100%",

                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",

                overflow: "hidden"
            }}>
                <FigureImage figureConfiguration={figureConfiguration} direction={2}/>
            </div>

            <div className="sprite_friends_close-button" style={{
                cursor: "pointer",

                position: "absolute",

                bottom: 1,
                right: 1
            }} onClick={onClose}/>
        </div>
    );
}
