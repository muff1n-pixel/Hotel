import { act, ReactNode, useState } from "react";
import DialogContent from "./DialogContent";

export type DialogTabsProps = {
    initialActiveIndex?: number;

    tabs: {
        icon: ReactNode;
        element: ReactNode;
    }[];
};

export default function DialogTabs({ initialActiveIndex = 1, tabs }: DialogTabsProps) {
    const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

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
                flexDirection: "column"
            }}>
                <div style={{
                    flex: 1,

                    display: "flex",

                    alignItems: "center"
                }}>
                    <h2>Muff1n-Pixel</h2>
                </div>

                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    transform: "translate(0px, 1px)",
                }}>
                    {tabs.map(({ icon }, index) => (
                        <div key={index} style={{
                            display: "flex",

                            height: 31,
                            width: 52,

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


                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",

                                overflow: "hidden",

                                cursor: "pointer"
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
