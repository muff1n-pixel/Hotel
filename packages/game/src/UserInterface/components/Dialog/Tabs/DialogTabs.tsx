import { PropsWithChildren, ReactNode, useState } from "react";
import DialogContent from "../DialogContent";

export type DialogTabHeaderProps = {
    iconImage?: string;
    backgroundImage?: string;

    title?: string;
    description?: string;
}

export type DialogTabsProps = PropsWithChildren & {
    initialActiveIndex?: number;
    withLargeTabs?: boolean;

    header?: DialogTabHeaderProps;
    withoutHeader?: boolean;

    tabs: {
        icon: ReactNode;
        element: ReactNode;
        header?: DialogTabHeaderProps;
    }[];

    onChange?: (index: number) => void;
};

export default function DialogTabs({ initialActiveIndex = 0, withoutHeader, tabs, header, withLargeTabs = false, children, onChange }: DialogTabsProps) {
    const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

    const currentHeader = tabs[activeIndex]?.header ?? header;

    const inactiveBackgroundColor = (withoutHeader)?("#C3C1B7"):("#7E8C8A");

    return (
        <div style={{
            flex: 1,

            display: "flex",
            flexDirection: "column",

            overflow: "hidden"
        }}>
            <div style={{
                height: (withoutHeader)?(40):(119),
                width: "100%",
               
                background: (withoutHeader)?(undefined):("#0E3F52"),
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
                                {(currentHeader.title) && (
                                    <h2>{currentHeader.title}</h2>
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

                                background: (activeIndex === index)?("#ECEAE0"):(inactiveBackgroundColor),

                                borderLeft: (activeIndex === index)?("2px solid white"):("2px solid " + inactiveBackgroundColor),
                                borderTop: (activeIndex === index)?("2px solid white"):("2px solid " + inactiveBackgroundColor),
                                borderRight: (activeIndex === index)?("2px solid white"):("2px solid " + inactiveBackgroundColor),
                                
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8,

                                minWidth: 30,

                                padding: (withLargeTabs)?("6px 10px"):((activeIndex === index)?("0 9px"):("0 10px")),

                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",

                                overflow: "hidden",

                                cursor: "pointer",

                                color: "black",
                                fontSize: 13
                            }} onClick={() => {
                                onChange?.(index);
                                setActiveIndex(index);
                            }}>
                                {icon}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <DialogContent key={activeIndex}>
                {tabs[activeIndex].element}

                {children}
            </DialogContent>
        </div>
    );
}
