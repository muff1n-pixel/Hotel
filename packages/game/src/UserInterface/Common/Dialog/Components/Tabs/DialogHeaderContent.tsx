import { PropsWithChildren } from "react";
import DialogContent from "../DialogContent";

export type DialogTabHeaderProps = {
    iconImage?: string;
    backgroundImage?: string;

    title?: string;
    description?: string;
}

export type DialogHeaderContentProps = PropsWithChildren & DialogTabHeaderProps;

export default function DialogHeaderContent({ iconImage, backgroundImage, title, description, children }: DialogHeaderContentProps) {
    return (
        <div style={{
            flex: 1,

            display: "flex",
            flexDirection: "column",
        }}>
            <div style={{
                height: 119,
                width: "100%",
               
                background: "#0E3F52",
                borderBottom: "1px solid black",
                boxSizing: "border-box",

                padding: "0 11px",

                display: "flex",
                flexDirection: "column",

                position: "relative"
            }}>
                <div style={{
                    position: "absolute",
                    left: 0,
                    top: 0,

                    padding: "12px",
                    boxSizing: "border-box",

                    width: "100%",
                    height: "100%",

                    display: "flex",
                    alignItems: "center"
                }}>
                    {(backgroundImage) && (
                        <img src={backgroundImage} style={{
                            position: "absolute",
                            
                            left: 0,
                            top: 0,

                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            imageRendering: "pixelated",

                            opacity: .05
                        }}/>
                    )}
                </div>

                <div style={{
                    flex: 1,

                    display: "flex",

                    alignItems: "center",

                    position: "relative",
                }}>
                    <div style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center"
                    }}>
                        {(iconImage) && (
                            <img src={iconImage} width={36} height={36} style={{
                                objectFit: "contain",
                                imageRendering: "pixelated",
                                margin: 10
                            }}/>
                        )}

                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center"
                        }}>
                            {(title) && (
                                <h2>{title}</h2>
                            )}

                            {(description) && (
                                <p style={{
                                    fontSize: (description.length > 200)?(11):(13)
                                }}>{description}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <DialogContent style={{
                gap: 10
            }}>
                {children}
            </DialogContent>
        </div>
    );
}
