import { FigureConfigurationData } from "@pixel63/events";
import FigureImage from "src/UserInterface/Common/Figure/FigureImage";

export type MessengerFigureProps = {
    figureConfiguration?: FigureConfigurationData;
};

export default function MessengerFigure({ figureConfiguration }: MessengerFigureProps) {
    return (
        <div style={{
            width: 50,
            height: 50,

            overflow: "hidden",

            borderRadius: "100%",

            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",

            background: "rgba(0, 0, 0, .1)",
            border: "2px solid rgba(0, 0, 0, .1)",

            cursor: "pointer"
        }}>
            <FigureImage figureConfiguration={figureConfiguration} direction={2}/>
        </div>
    );
}
