import { FigureConfigurationData } from "@pixel63/events";
import FigureImage from "@UserInterface/Common/Figure/FigureImage";

export type MessengerFigureProps = {
    figureConfiguration?: FigureConfigurationData;
    
    onClick?: () => void;
    onClose?: () => void;
};

export default function MessengerFigure({ figureConfiguration, onClick, onClose }: MessengerFigureProps) {
    return (
        <div style={{
            width: 30,
            height: 30,

            borderRadius: "100%",

            background: "rgba(0, 0, 0, .1)",
            border: "2px solid rgba(0, 0, 0, .1)",

            cursor: "pointer",

            position: "relative"
        }}>
            <div style={{
                width: 25,
                height: 25,

                borderRadius: "100%",

                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",

                overflow: "hidden"
            }} onClick={onClick}>
                <FigureImage figureConfiguration={figureConfiguration} direction={2} scale={0.5}/>
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
