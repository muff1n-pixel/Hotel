import FigureImage from "../Figure/FigureImage";
import { useUser } from "../../hooks/useUser";
import DialogButton from "../Dialog/Button/DialogButton";

export default function Reception() {
    const user = useUser();

    return (
        <div style={{
            position: "absolute",

            left: 0,

            bottom: 47,

            width: "100%",
            height: "100%",

            background: "url(/assets/reception/habbo20_background_gradient.png)",
            backgroundSize: "contain"
        }}>
            <div style={{
                position: "absolute",
                left: 100,
                top: 47
            }}>
                <img src="/assets/reception/reception_logo_drape.png"/>
            </div>

            <div style={{
                position: "absolute",

                left: 300,
                top: 80
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    pointerEvents: "auto"
                }}>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",

                        width: 140,
                        height: 140
                    }}>
                        <img src="/assets/reception/promos/discord.png"/>
                    </div>

                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        maxWidth: 400
                    }}>
                        <div style={{
                            fontFamily: "Ubuntu Medium",
                            fontSize: 16
                        }}>
                            Connect to the Pixel63 development Discord
                        </div>

                        <p>
                            There is a Discord server that follows the development of the Pixel63 client. Join it to participate in discussions!
                        </p>

                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end"
                        }}>
                            <DialogButton onClick={() => window.open("/discord", "_blank")?.focus()}>Join the Discord server</DialogButton>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{
                position: "absolute",

                left: 0,
                bottom: 0
            }}>
                <img src="/assets/reception/nov19_background_left.png"/>

                {(user.figureConfiguration) && (
                    <div style={{
                        position: "absolute",
                        left: 145,
                        bottom: 38
                    }}>
                        <FigureImage figureConfiguration={user.figureConfiguration} direction={2}/>
                    </div>
                )}
            </div>
            
            <div style={{
                position: "absolute",

                right: 0,
                bottom: 0
            }}>
                <img src="/assets/reception/default_new_bg_right.png"/>
            </div>
        </div>
    );
}
