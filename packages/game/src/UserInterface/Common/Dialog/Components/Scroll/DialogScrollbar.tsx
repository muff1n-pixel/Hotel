import { RefObject, useCallback, useEffect, useRef, useState } from "react";

export type DialogScrollbarProps = {
    containerRef: RefObject<HTMLDivElement | null>;
    hideInactive?: boolean;
    reversed?: boolean;
}

const scrollHandleBackgroundImage = new URL('../../../../Images/dialog/scroll/handle_background.png', import.meta.url);

const scrollBackgroundImageEnabled = new URL('../../../../Images/dialog/scroll/enabled_background.png', import.meta.url);
const scrollBackgroundImageDisabled = new URL('../../../../Images/dialog/scroll/disabled_background.png', import.meta.url);

const ARROW_SCROLL_AMOUNT = 30;

export default function DialogScrollbar({ reversed, containerRef, hideInactive }: DialogScrollbarProps) {
    const handleContainerRef = useRef<HTMLDivElement>(null);

    const [active, setActive] = useState(false);

    const [scrollPercentage, setScrollPercentage] = useState(0);
    const [containerHeightPercentage, setContainerHeightPercentage] = useState(100);

    const isDragging = useRef(false);
    const dragStartY = useRef(0);
    const dragStartScrollTop = useRef(0);

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

            const scrollPercentage = (Math.abs(containerRef.current.scrollTop) / fullContainerHeight) * 100;

            setScrollPercentage(scrollPercentage);
        };

        resizeListener();
        scrollListener();

        containerRef.current.addEventListener("scroll", scrollListener);

        const observer = new MutationObserver(() => {
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

    const scrollBy = useCallback((amount: number) => {
        if(!containerRef.current) return;

        const direction = (reversed)?(-1):(1);

        containerRef.current.scrollTop += amount * direction;
    }, [containerRef, reversed]);

    const onTrackClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        if(!containerRef.current || !handleContainerRef.current || isDragging.current) return;

        if((event.target as HTMLDivElement).classList.contains('dialog-scroll-bar-handle')) {
            return;
        }

        const trackRect = handleContainerRef.current.getBoundingClientRect();
        const clickY = event.clientY - trackRect.top;
        const trackHeight = trackRect.height;

        const clickPercentage = clickY / trackHeight;

        const container = containerRef.current;
        const maxScroll = container.scrollHeight - container.clientHeight;

        if(reversed) {
            container.scrollTop = -(clickPercentage * maxScroll);
        } else {
            container.scrollTop = clickPercentage * maxScroll;
        }
    }, [containerRef, reversed]);

    const onHandleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if(!containerRef.current || !handleContainerRef.current) return;

        e.preventDefault();
        e.stopPropagation();

        isDragging.current = true;
        dragStartY.current = e.clientY;
        dragStartScrollTop.current = containerRef.current.scrollTop;
        document.body.style.cursor = "grabbing";
    }, [containerRef]);

    useEffect(() => {
        const onMouseMove = (event: MouseEvent) => {
            if(!isDragging.current || !containerRef.current || !handleContainerRef.current) {
                return;
            }

            const trackHeight = handleContainerRef.current.clientHeight;
            const container = containerRef.current;

            const fullContainerHeight = containerRef.current.scrollHeight;

            const deltaY = ((dragStartScrollTop.current / fullContainerHeight) * trackHeight) + (event.clientY - dragStartY.current);
            const scrollPosition = (deltaY / trackHeight) * (fullContainerHeight);

            container.scrollTop = scrollPosition;
        };

        const onMouseUp = () => {
            isDragging.current = false;
            document.body.style.cursor = "";
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);

        return () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
    }, [containerRef]);

    return (
        <div style={{
            display: (hideInactive && !active)?("none"):("flex"),
            flexDirection: "column",

            pointerEvents: "auto",
        }}>
            <div
                className={(active)?("sprite_dialog_scroll_enabled_top"):("sprite_dialog_scroll_disabled_top")}
                style={{ cursor: active ? "pointer" : undefined }}
                onMouseDown={(event) => {
                    if(!active) {
                        return;
                    }
                    
                    event.preventDefault();

                    scrollBy(-ARROW_SCROLL_AMOUNT);
                }}
            />

            <div ref={handleContainerRef} style={{
                flex: 1,

                display: "flex",

                width: "100%",
                background: (active)?(`url(${scrollBackgroundImageEnabled.toString()})`):(`url(${scrollBackgroundImageDisabled.toString()})`),

                position: "relative",
                cursor: active ? "pointer" : undefined,
            }}
                onClick={active ? onTrackClick : undefined}
            >
                {(active) && (
                    <div
                        className="dialog-scroll-bar-handle"
                        style={{
                            position: "absolute",

                            top: (!reversed)?(`${scrollPercentage}%`):(undefined),
                            bottom: (reversed)?(`${scrollPercentage}%`):(undefined),

                            height: `${containerHeightPercentage}%`,

                            display: "flex",
                            flexDirection: "column",
                            cursor: "grab",
                        }}
                        onMouseDown={onHandleMouseDown}
                    >
                        <div className={"sprite_dialog_scroll_handle_top"} style={{ pointerEvents: "none" }}/>

                        <div style={{
                            flex: 1,

                            width: "100%",
                            background: `url(${scrollHandleBackgroundImage.toString()})`,
                            pointerEvents: "none"
                        }}/>

                        <div className={"sprite_dialog_scroll_handle_top"} style={{
                            transform: "rotateZ(180deg)",
                            pointerEvents: "none"
                        }}/>
                    </div>
                )}
            </div>

            <div
                className={(active)?("sprite_dialog_scroll_enabled_top"):("sprite_dialog_scroll_disabled_top")}
                style={{
                    transform: "rotateZ(180deg)",
                    cursor: active ? "pointer" : undefined,
                }}
                onMouseDown={(e) => {
                    if(!active) return;
                    e.preventDefault();
                    scrollBy(ARROW_SCROLL_AMOUNT);
                }}
            />
        </div>
    );
}
