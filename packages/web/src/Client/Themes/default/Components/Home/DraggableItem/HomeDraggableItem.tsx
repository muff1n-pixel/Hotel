import { useState, useEffect, useRef, RefObject } from "react";
import "./HomeDraggableItem.css";
import { HomeItemType, HomeType, HomeUserType } from "../../../Pages/HomePage/HomePage";
import CrossIcon from '../../../Images/icons/small/cross.gif'
import EditIcon from '../../../Images/icons/small/tools_edit.gif'
import HomeWidgetProfile from "./Widget/User/Profile/HomeWidgetProfile";
import './Widget/Widget.css'
import HomeWidgetBadges from "./Widget/User/Badges/HomeWidgetBadges";
import HomeWidgetGroups from "./Widget/User/Groups/HomeWidgetGroups";
import HomeWidgetRooms from "./Widget/User/Rooms/HomeWidgetRooms";
import HomeWidgetFriends from "./Widget/User/Friends/HomeWidgetFriends";
import HomeWidgetGuestbook from "./Widget/User/Guestbook/HomeWidgetGuestbook";
import HomeWidgetNote from "./Widget/User/Note/HomeWidgetNote";

type Position = {
    x: number;
    y: number;
};

type Props = {
    index: number;
    restoreIndex: (id: string, index: number) => void;
    parentRef?: RefObject<HTMLDivElement | null>;
    homeItem: HomeItemType;
    homeType: HomeType;
    editMode: boolean;
    activeUser: HomeUserType;
    bringToFront: (id: string) => number;
    removeItem: (id: string) => void;
    setItems: React.Dispatch<React.SetStateAction<HomeItemType[]>>;
};

const borderSkins = [{
    id: 'none',
    name: 'None'
},
{
    id: 'default',
    name: 'Default'
},
{
    id: 'golden',
    name: 'Golden'
},
{
    id: 'metal',
    name: 'Metal'
},
{
    id: 'notepad',
    name: 'Notepad'
},
{
    id: 'speech_bubble',
    name: 'Speech Bubble'
},
{
    id: 'stickie_note',
    name: 'Stickie Note'
},
{
    id: 'hc_bling',
    name: 'HC Bling'
},
{
    id: 'hc_scifi',
    name: 'HC Scifi'
}]

const HomeDraggableItem = ({
    index,
    restoreIndex,
    parentRef,
    homeItem,
    homeType,
    editMode,
    activeUser,
    bringToFront,
    removeItem,
    setItems
}: Props) => {
    const itemRef = useRef<HTMLDivElement | null>(null);

    const [position, setPosition] = useState<Position>({
        x: homeItem.positionX as number,
        y: homeItem.positionY as number
    });

    const [startPosition, setStartPosition] = useState<Position>(position);
    const [prevValidPosition, setPrevValidPosition] = useState<Position>(position);

    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });
    const [isReturning, setIsReturning] = useState(false);

    const [activeItem, setActiveItem] = useState<boolean>(false);
    const [showBorderModal, setShowBorderModal] = useState<boolean>(false);

    const startIndexRef = useRef<number | null>(null);
    const hasMovedRef = useRef(false);

    const threshold = 5;

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        hasMovedRef.current = false;

        const rect = e.currentTarget.getBoundingClientRect();

        setOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });

        setStartPosition(position);
        setDragging(true);
        setActiveItem(true);
        setIsReturning(false);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const item = itemRef.current;

            if (!item) return;

            if (!item.contains(e.target as Node)) {
                setActiveItem(false);
                setShowBorderModal(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setActiveItem]);

    useEffect(() => {
        recalculatePosition();
    }, [homeItem]);

    const recalculatePosition = () => {
        const parent = parentRef?.current;
        const item = itemRef.current;

        if (!parent || !item) return;

        const parentRect = parent.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();

        let newX = position.x;
        let newY = position.y;

        if (newX < 0) newX = 0;
        if (newX + itemRect.width > parentRect.width) {
            newX = parentRect.width - itemRect.width;
        }

        if (newY < 0) newY = 0;
        if (newY + itemRect.height > parentRect.height) {
            newY = parentRect.height - itemRect.height;
        }

        if (newX !== position.x || newY !== position.y) {
            setPosition({ x: newX, y: newY });
            setPrevValidPosition({ x: newX, y: newY });
        }
    }

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!dragging) return;

            const parent = parentRef?.current;
            const item = itemRef.current;
            if (!parent || !item) return;

            const parentRect = parent.getBoundingClientRect();

            let newX = e.clientX - parentRect.left - offset.x;
            let newY = e.clientY - parentRect.top - offset.y;

            newX = Math.max(0, Math.min(newX, parent.clientWidth - item.offsetWidth));
            newY = Math.max(0, Math.min(newY, parent.clientHeight - item.offsetHeight));

            const dx = Math.abs(newX - startPosition.x);
            const dy = Math.abs(newY - startPosition.y);

            if (!hasMovedRef.current && (dx > threshold || dy > threshold)) {
                hasMovedRef.current = true;

                startIndexRef.current = bringToFront(homeItem.id);
            }

            setPosition({ x: newX, y: newY });
        };

        const handleMouseUp = () => {
            if (!dragging) return;

            const parent = parentRef?.current;
            const item = itemRef.current;
            if (!parent || !item) return;

            setDragging(false);

            if (!hasMovedRef.current) {
                setActiveItem(true);
                setDragging(false);
                return;
            }

            const parentRect = parent.getBoundingClientRect();
            const itemRect = item.getBoundingClientRect();

            const isInside =
                position.x >= 0 &&
                position.y >= 0 &&
                position.x + itemRect.width <= parentRect.width &&
                position.y + itemRect.height <= parentRect.height;

            if (!isInside) {
                setIsReturning(true);
                setPosition(startPosition);

                if (startIndexRef.current !== null) {
                    restoreIndex(homeItem.id, startIndexRef.current);
                }

                return;
            }

            fetch("/api/home/move", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    homeType: homeType === HomeType.User ? "user" : "group",
                    itemId: homeItem.id,
                    positionX: position.x,
                    positionY: position.y
                })
            })
                .then(res => res.json())
                .then(result => {
                    if (result.error) {
                        setIsReturning(true);
                        setPosition(prevValidPosition);

                        if (startIndexRef.current !== null) {
                            restoreIndex(homeItem.id, startIndexRef.current);
                        }

                        return;
                    }

                    setPrevValidPosition(position);
                })
                .catch(() => {
                    setIsReturning(true);
                    setPosition(prevValidPosition);

                    if (startIndexRef.current !== null) {
                        restoreIndex(homeItem.id, startIndexRef.current);
                    }
                });
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging, offset, position, startPosition, parentRef]);

    const editSkin = (value: string) => {
        fetch("/api/home/skin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                homeType: homeType === HomeType.User ? 'user' : 'group',
                itemId: homeItem.id,
                borderSkin: value
            })
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.error) {
                    console.error(`Impossible to edit skin of widget: ${result.error}`)
                    return;
                } else if (result.success) {
                    setShowBorderModal(false);
                    setItems((prevItems) =>
                        prevItems.map((item) =>
                            item.id === homeItem.id
                                ? { ...item, borderSkin: value }
                                : item
                        )
                    );
                }
            })
            .catch((e) => {
                console.error("(Error) Impossible to get items:", e)
            })
    }

    const renderWidget = () => {
        switch (homeItem.itemId) {
            case 'widgets_profile':
                return (
                    <HomeWidgetProfile
                        borderSkin={homeItem.borderSkin}
                        activeUser={activeUser}
                    />
                );

            case 'widgets_badges':
                return (
                    <HomeWidgetBadges
                        borderSkin={homeItem.borderSkin}
                        activeUser={activeUser}
                    />
                );

            case 'widgets_groups':
                return (
                    <HomeWidgetGroups
                        borderSkin={homeItem.borderSkin}
                        activeUser={activeUser}
                    />
                );

            case 'widgets_rooms':
                return (
                    <HomeWidgetRooms
                        borderSkin={homeItem.borderSkin}
                        activeUser={activeUser}
                    />
                );

            case 'widgets_friends':
                return (
                    <HomeWidgetFriends
                        borderSkin={homeItem.borderSkin}
                        activeUser={activeUser}
                    />
                );

            case 'widgets_guestbook':
                return (
                    <HomeWidgetGuestbook
                        borderSkin={homeItem.borderSkin}
                        activeUser={activeUser}
                        recalculatePosition={recalculatePosition}
                    />
                );

            case 'notes_note':
                return (
                    <HomeWidgetNote
                        borderSkin={homeItem.borderSkin}
                        item={homeItem}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div
            id={`item-${homeItem.id}`}
            ref={itemRef}
            className={`draggableItem ${isReturning ? "returning" : ""} ${editMode ? "edit" : ""}`}
            onMouseDown={editMode ? handleMouseDown : undefined}
            style={{
                left: position.x,
                top: position.y,
                width: homeItem.itemType === "stickers" ? homeItem.itemWidth : 'auto',
                height: homeItem.itemType === "stickers" ? homeItem.itemHeight : 'auto',
                zIndex: dragging ? 9999 : "auto",
                backgroundImage:
                    homeItem.itemType === "stickers"
                        ? `url("/assets/home/stickers/${homeItem.itemImage}")`
                        : undefined
            }}
        >
            <div style={{ userSelect: editMode ? ('none') : "initial", pointerEvents: editMode ? ('none') : "initial" }}>
                {renderWidget()}
            </div>

            {activeItem &&
                <>
                    <div className={`buttons ${homeItem.itemType}`}>
                        {homeItem.itemId !== 'widgets_profile' && <button onClick={(() => {
                            removeItem(homeItem.id)
                        })}><img src={CrossIcon} alt="Cross Icon" /></button>}
                        {(homeItem.itemType === 'widgets' || homeItem.itemType === 'notes') &&
                            <button onClick={() => setShowBorderModal(prev => !prev)}><img src={EditIcon} alt="Edit Icon" /></button>
                        }
                    </div>

                    {showBorderModal &&
                        <div className="borderSkinModal">
                            <div className="borderSkinModalHeader">
                                <div className="title">Edit theme</div>
                                <div className="close_button" onClick={() => setShowBorderModal(prev => !prev)}></div>
                            </div>

                            <div className="content">
                                <select value={homeItem.borderSkin as string} onChange={(e) => editSkin(e.target.value)}>
                                    {borderSkins.map((skin) => (
                                        <option key={skin.id} value={skin.id}>
                                            {skin.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>}
                </>
            }
        </div>
    );
};

export default HomeDraggableItem;