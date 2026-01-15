import { act, Fragment, ReactNode, useContext, useState } from "react";
import DialogContent from "../DialogContent";
import { AppContext } from "../../../contexts/AppContext";

export type DialogTabHeaderProps = {
    iconImage?: string;
    backgroundImage?: string;

    label?: string;
    description?: string;
}

export type DialogTabsProps = {
    initialActiveIndex?: number;
    withLargeTabs?: boolean;

    header?: DialogTabHeaderProps;

    tabs: {
        icon: ReactNode;
        element: ReactNode;
        header?: DialogTabHeaderProps;
    }[];
};

export default function DialogTabs({ initialActiveIndex = 1, tabs, header, withLargeTabs = false }: DialogTabsProps) {
    const { user } = useContext(AppContext);

    const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

    const currentHeader = tabs[activeIndex].header ?? header;

    return (
        <div style={{
            flex: 1,

            display: "flex",
            flexDirection: "column"
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
                {(currentHeader) && (
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
                        {(currentHeader.backgroundImage) && (
                            <img src={currentHeader.backgroundImage} style={{
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
                )}

                <div style={{
                    flex: 1,

                    display: "flex",

                    alignItems: "center",

                    position: "relative",
                }}>
                    {(currentHeader) && (
                        <div style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "row",
                            gap: 10,
                            alignItems: "center"
                        }}>
                            {(currentHeader.iconImage) && (
                                <img src={currentHeader.iconImage} width={36} height={36} style={{
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
                                {(currentHeader.label) && (
                                    <h2>{currentHeader.label}</h2>
                                )}

                                {(currentHeader.description) && (
                                    <p>{currentHeader.description}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    transform: "translate(0px, 1px)",
                }}>
                    {tabs.map(({ icon }, index) => (
                        <div key={index} style={{
                            display: "flex",

                            flex: (withLargeTabs)?(1):(undefined),

                            height: 31,
                            minWidth: 52,

                            border: (activeIndex === index)?("2px solid black"):("1px solid #272E31"),
                            borderBottom: (activeIndex === index)?("none"):("1px solid #272E31"),
                            
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,

                            overflow: "hidden"
                        }}>
                            <div style={{
                                flex: 1,

                                background: (activeIndex === index)?("#ECEAE0"):("#7E8C8A"),

                                borderLeft: (activeIndex === index)?("2px solid white"):("2px solid #7E8C8A"),
                                borderTop: (activeIndex === index)?("2px solid white"):("2px solid #7E8C8A"),
                                borderRight: (activeIndex === index)?("2px solid white"):("2px solid #7E8C8A"),
                                
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8,

                                padding: (withLargeTabs)?("6px 6px"):("0 6px"),

                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",

                                overflow: "hidden",

                                cursor: "pointer",

                                color: "black",
                                fontSize: 13
                            }} onClick={() => setActiveIndex(index)}>
                                {icon}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <DialogContent key={activeIndex}>
                {tabs[activeIndex].element}
            </DialogContent>
        </div>
    );
}
