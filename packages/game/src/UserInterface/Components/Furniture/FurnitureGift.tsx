import { FigureConfigurationData } from "@pixel63/events";
import FigureImage from "@UserInterface/Common/Figure/FigureImage";

export type FurnitureGiftProps = {
    name: string;
    message?: string;
    figureConfiguration?: FigureConfigurationData;

    onChange?: (message: string) => void;
};

export default function FurnitureGift({ name, message, figureConfiguration, onChange }: FurnitureGiftProps) {
    return (
        <div className="sprite_users_gift" style={{
            position: "relative"
        }}>
            <div style={{
                position: "absolute",

                left: 0,
                top: 0,

                width: 68,
                height: 144,

                display: "flex",

                justifyContent: "center",
                alignItems: "center"
            }}>
                <FigureImage figureConfiguration={figureConfiguration} direction={2} headOnly/>
            </div>
            
            <div style={{
                position: "absolute",

                left: 68,
                top: 9,

                width: 225,
                height: 126,

                display: "flex",
                flexDirection: "column",
                gap: 5,

                padding: 5,
                boxSizing: "border-box"
            }}>
                <textarea readOnly={!onChange} placeholder={(onChange)?("Write your best wishes here!"):("No message left.")} value={message} onChange={(event) => onChange?.((event.currentTarget as HTMLTextAreaElement).value)} style={{
                    flex: 1,

                    outline: "none",
                    background: "transparent",
                    margin: 0,
                    border: 0,
                    padding: 0,
                    fontFamily: "Ubuntu",
                    fontSize: 12,
                    resize: "none"
                }}/>

                <div style={{
                    textAlign: "right"
                }}>
                    <b><i>- {name}</i></b>
                </div>
            </div>
        </div>
    );
}