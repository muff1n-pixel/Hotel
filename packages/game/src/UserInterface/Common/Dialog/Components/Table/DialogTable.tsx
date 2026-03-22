import DialogScrollArea from "@UserInterface/Common/Dialog/Components/Scroll/DialogScrollArea";
import { Fragment, ReactNode, useEffect, useRef, useState } from "react";

export type DialogTableProps = {
    activeId?: any;

    flex?: number[];
    columns?: string[];
    items?: {
        id: any;
        preview?: ReactNode;
        values: ReactNode[];
        tools?: ReactNode;
        onClick?: () => void;
    }[];

    tools?: ReactNode;
};

export default function DialogTable({ activeId, flex, columns, items, tools }: DialogTableProps) {
    const [_activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        if(!items) {
            return;
        }

        const listener = (event: KeyboardEvent) => {
            if(event.key === "ArrowDown") {
                event.preventDefault();

                const currentIndex = items.findIndex((item) => item.id === _activeId);

                if(currentIndex !== -1 && currentIndex !== items?.length - 1) {
                    const nextItem = items[currentIndex + 1];

                    nextItem?.onClick?.();
                    setActiveId(nextItem.id);
                }
            }
            else if(event.key === "ArrowUp") {
                event.preventDefault();

                const currentIndex = items.findIndex((item) => item.id === _activeId);

                if(currentIndex !== -1 && currentIndex !== 0) {
                    const nextItem = items[currentIndex - 1];

                    nextItem?.onClick?.();
                    setActiveId(nextItem.id);
                }
            }
        };

        document.addEventListener("keydown", listener);

        return () => {
            document.removeEventListener("keydown", listener);
        };
    }, [items, _activeId]);

    return (
        <div style={{
            flex: 1,

            border: "1px solid #5D5D5A",
            borderRadius: 6,

            background: "#FFF",

            display: "flex",
            flexDirection: "column",

            padding: 4,
            gap: 4
        }}>
            {(columns) && (
                <Fragment>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 5,
                        padding: 4
                    }}>
                        {columns.map((column, index) => (
                            <div key={column} style={{
                                flex: flex?.[index] ?? 1
                            }}>
                                <div style={{
                                    color: "#000",
                                    fontFamily: "Ubuntu Bold",
                                    fontSize: 12
                                }}>
                                    {column}
                                </div>
                            </div>
                        ))}

                        {tools}
                    </div>

                    <div style={{
                        background: "#AFAFAF",

                        height: 1
                    }}/>
                </Fragment>
            )}

            <DialogScrollArea style={{ gap: 10 }} hideInactive>
                {items?.map((item) => (
                    <div key={item.id} style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 10,
                        padding: 4,
                        background: (item.id === (activeId ?? _activeId))?("#B8E2FC"):("transparent"),
                        cursor: "pointer"
                    }} onClick={() => {
                        setActiveId(item.id);
                        item.onClick?.();
                    }}>
                        {(item.preview) && (
                            <div>
                                {item.preview}
                            </div>
                        )}

                        <div style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 5,
                        }}>
                            {item.values.map((value, index) => (
                                <div key={value?.toString()} style={{
                                    flex: flex?.[index] ?? 1,
                                }}>
                                    <div style={{
                                        color: "#000",
                                        fontSize: 12
                                    }}>
                                        {(value?.toString().length)?(value):(<i>Empty</i>)}
                                    </div>
                                </div>
                            ))}

                            {item.tools}
                        </div>
                    </div>
                ))}
            </DialogScrollArea>
        </div>
    );
}
