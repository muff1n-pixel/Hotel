import { RefObject, useEffect, useRef, useState } from "react";

export type DialogScrollbarProps = {
    containerRef: RefObject<HTMLDivElement | null>;
    hideInactive?: boolean;
}

const scrollHandleBackgroundImage = new URL('../../../images/dialog/scroll/handle_background.png', import.meta.url);

const scrollBackgroundImageEnabled = new URL('../../../images/dialog/scroll/enabled_background.png', import.meta.url);
const scrollBackgroundImageDisabled = new URL('../../../images/dialog/scroll/disabled_background.png', import.meta.url);

export default function DialogScrollbar({ containerRef, hideInactive }: DialogScrollbarProps) {
    const handleContainerRef = useRef<HTMLDivElement>(null);

    const [active, setActive] = useState(false);

    const [scrollPercentage, setScrollPercentage] = useState(0);
    const [containerHeightPercentage, setContainerHeightPercentage] = useState(100);

    useEffect(() => {
        if(!containerRef.current) {
            return;
        }

        if(!handleContainerRef.current) {
            return;
        }

        const resizeListener = () => {
            if(!containerRef.current) {
                return;
            }
            
            const containerHeight = containerRef.current.clientHeight;
            const fullContainerHeight = containerRef.current.scrollHeight;

            setActive(fullContainerHeight > containerHeight);

            const visibleContainerPercentange = (containerHeight / fullContainerHeight) * 100;

            setContainerHeightPercentage(visibleContainerPercentange);
        };

        const scrollListener = () => {
            if(!containerRef.current) {
                return;
            }

            const fullContainerHeight = containerRef.current.scrollHeight;

            const scrollPercentage = (containerRef.current.scrollTop / fullContainerHeight) * 100;

            setScrollPercentage(scrollPercentage);
        };

        resizeListener();
        scrollListener();

        containerRef.current.addEventListener("scroll", scrollListener);

        const observer = new MutationObserver(() => {
            console.log("resize");

            resizeListener();
        });

        observer.observe(containerRef.current, {
            childList: true,
            subtree: true
        });

        return () => {
            containerRef.current?.removeEventListener("scroll", scrollListener);

            observer.disconnect();
        };
    }, [containerRef, handleContainerRef]);

    return (
        <div style={{
            display: (hideInactive && !active)?("none"):("flex"),
            flexDirection: "column",

            // TODO: add mouse events
            pointerEvents: "none",
        }}>
            <div className={(active)?("sprite_dialog_scroll_enabled_top"):("sprite_dialog_scroll_disabled_top")}/>

            <div ref={handleContainerRef} style={{
                flex: 1,

                display: "flex",

                width: "100%",
                background: (active)?(`url(${scrollBackgroundImageEnabled.toString()})`):(`url(${scrollBackgroundImageDisabled.toString()})`),

                position: "relative"
            }}>
                {(active) && (
                    <div style={{
                        position: "absolute",

                        top: `${scrollPercentage}%`,

                        height: `${containerHeightPercentage}%`,

                        display: "flex",
                        flexDirection: "column"
                    }}>
                        <div className={"sprite_dialog_scroll_handle_top"}/>

                        <div style={{
                            flex: 1,

                            width: "100%",
                            background: `url(${scrollHandleBackgroundImage.toString()})`,
                        }}/>

                        <div className={"sprite_dialog_scroll_handle_top"} style={{
                            transform: "rotateZ(180deg)"
                        }}/>
                    </div>
                )}
            </div>

            <div className={(active)?("sprite_dialog_scroll_enabled_top"):("sprite_dialog_scroll_disabled_top")} style={{
                transform: "rotateZ(180deg)"
            }}/>
        </div>
    );
}
