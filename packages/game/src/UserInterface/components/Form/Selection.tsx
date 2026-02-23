import { ReactNode, useEffect, useRef, useState } from "react";

export type SelectionProps = {
    value: any;
    
    items: {
        value: any;
        label: ReactNode;
    }[];

    onChange: (value: any) => void;
}

export default function Selection({ value, items, onChange }: SelectionProps) {
    const elementRef = useRef<HTMLDivElement>(null);

    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        if(!expanded) {
            return;
        }

        if(!elementRef.current) {
            return;
        }

        const listener = (event: MouseEvent) => {
            if(elementRef.current?.contains(event.target as Element)) {
                return;
            }

            setExpanded(false);
        };

        document.body.addEventListener("click", listener);

        return () => {
            document.body.removeEventListener("click", listener);
        };
    }, [elementRef.current, expanded]);

    return (
        <div ref={elementRef} style={{
            borderBottom: "1px solid #FFFFFF",
            borderRadius: 6
        }}>
            <div style={{

                fontSize: 12,

                position: "relative"
            }}>
                <div style={{
                    width: "100%",
                    
                    display: "flex",
                    flexDirection: "row",

                    height: 24,

                    background: "#FFFFFF",
                    border: "1px solid #808080",
                    borderRadius: 6,

                    alignItems: "center",

                    cursor: "pointer"
                }} onClick={() => setExpanded(true)}>
                    <div style={{
                        flex: 1,
                        paddingLeft: 6,
                    }}>
                        {items.find((item) => item.value === value)?.label}
                    </div>

                    <div style={{
                        width: 20
                    }}>
                        <div className="sprite_forms_arrow"/>
                    </div>
                </div>

                {(expanded) && (
                    <div style={{
                        position: "absolute",
                        left: 0,
                        top: 0,

                        zIndex: 1,

                        width: "100%",

                        background: "#FFFFFF",
                        border: "1px solid #808080",
                        borderRadius: 6,

                        maxHeight: 200,
                        overflowY: "scroll"
                    }}>
                        {items.map((item) => (
                            <div key={item.value} style={{
                                height: 24,

                                paddingLeft: 6,

                                display: "flex",

                                alignItems: "center",

                                cursor: "pointer"
                            }} onClick={() => {
                                setExpanded(false);
                                onChange(item.value);
                            }}>
                                {item.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
