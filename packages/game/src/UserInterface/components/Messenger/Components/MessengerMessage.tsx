import FigureImage from "src/UserInterface/Common/Figure/FigureImage";
import "./MessengerMessage.css";
import { FigureConfigurationData } from "@pixel63/events";

export type MessengerMessageProps = {
    name: string;
    figureConfiguration?: FigureConfigurationData;
    messages: string[];

    side: "left" | "right";
};

export default function MessengerMessage({ name, side, figureConfiguration, messages }: MessengerMessageProps) {
    return (
        <div style={{
            display: "flex",
            flexDirection: (side === "right")?("row"):("row-reverse"),
            gap: 5
        }}>
            <div style={{
                flex: 1,

                display: "flex",
                flexDirection: "column",
                gap: 3,

                padding: "0 0 6px"
            }}>
                <b style={{ fontSize: 12, padding: "0 6px" }}>{name}:</b>

                <div style={{
                    flex: 1
                }}>
                    <div className={`messenger-message-bubble messenger-message-bubble-${side}`} style={{
                        background: "#FFFFFF",
                        border: "1px solid #CCCCCC",
                        borderRadius: 10,
                        padding: "5px 10px",

                        fontSize: 12
                    }}>
                        {messages.map((message, index) => (
                            <div key={index}>{message}</div>
                        ))}
                    </div>
                </div>

                <div style={{ fontSize: 10, padding: "0 6px" }}><i>23 minutes ago</i></div>
            </div>

            <div style={{
                width: 50,
                height: 50,

                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",

                overflow: "hidden"
            }}>
                <FigureImage figureConfiguration={figureConfiguration} direction={(side === "left")?(2):(4)} cropped/>
            </div>
        </div>
    );
}
