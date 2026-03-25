import HomeDraggableItem from "./DraggableItem/HomeDraggableItem";
import "./HomePlayground.css";
import { HomeItemType, HomeType, HomeUserType } from "../../Pages/HomePage/HomePage";
import './HomeSkin.css';

type Props = {
    homeType: HomeType;
    playgroundRef: React.RefObject<HTMLDivElement | null>;
    items: HomeItemType[];
    editMode: boolean;
    inventoryRef: React.RefObject<HTMLButtonElement | null>;
    setItems: React.Dispatch<React.SetStateAction<HomeItemType[]>>;
    activeUser: HomeUserType;
};

const HomePlayground = ({ homeType, playgroundRef, items, editMode, inventoryRef, activeUser, setItems }: Props) => {
    const backgroundUrl = items.find(i => i.itemType === "backgrounds")?.itemImage;

    const bringToFront = (id: string): number => {
        let originalIndex = -1;

        setItems(prev => {
            originalIndex = prev.findIndex(i => i.id === id);

            const item = prev[originalIndex];
            if (!item) return prev;

            const filtered = prev.filter(i => i.id !== id);
            return [...filtered, item];
        });

        return originalIndex;
    };

    const restoreIndex = (id, originalIndex) => {
        setItems(prev => {
            const itemIndex = prev.findIndex(i => i.id === id);
            const item = prev[itemIndex];
            if (!item) return prev;

            const newArray = [...prev];
            newArray.splice(itemIndex, 1);
            newArray.splice(originalIndex, 0, item);

            return newArray;
        });
    };

    const animateToInventory = (itemEl: HTMLElement, targetEl: HTMLElement | null) => {
        if (!targetEl) return;

        const itemRect = itemEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();

        const startX = itemRect.left;
        const startY = itemRect.top;

        const endX = targetRect.left + targetRect.width / 2;
        const endY = targetRect.top + targetRect.height / 2;

        const clone = itemEl.cloneNode(true) as HTMLElement;

        const cross = clone.querySelector(".buttons");
        if (cross) (cross as HTMLElement).remove();

        clone.style.position = "fixed";
        clone.style.left = `${startX}px`;
        clone.style.top = `${startY}px`;
        clone.style.width = `${itemRect.width}px`;
        clone.style.height = `${itemRect.height}px`;
        clone.style.pointerEvents = "none";
        clone.style.zIndex = "9999";

        document.body.appendChild(clone);

        const duration = 600;
        const startTime = performance.now();

        const controlX = (startX + endX) / 2;
        const controlY = Math.min(startY, endY) - 150;

        const animate = (time: number) => {
            const t = Math.min((time - startTime) / duration, 1);

            const ease = 1 - Math.pow(1 - t, 3);

            const x =
                (1 - ease) * (1 - ease) * startX +
                2 * (1 - ease) * ease * controlX +
                ease * ease * endX;

            const y =
                (1 - ease) * (1 - ease) * startY +
                2 * (1 - ease) * ease * controlY +
                ease * ease * endY;

            const scale = 1 - ease * 0.8;
            const opacity = 1 - ease;

            clone.style.transform = `translate(${x - startX}px, ${y - startY}px) scale(${scale})`;
            clone.style.opacity = `${opacity}`;

            if (t < 1) {
                requestAnimationFrame(animate);
            } else {
                clone.remove();
            }
        };

        requestAnimationFrame(animate);
    };

    const removeItem = (itemId: string) => {
        const itemEl = document.getElementById(`item-${itemId}`);

        if (itemEl) {
            animateToInventory(itemEl, inventoryRef.current);
        }

        fetch("/api/home/remove", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                homeType: homeType === HomeType.User ? "user" : "group",
                itemId: itemId
            })
        })
            .then(res => res.json())
            .then(result => {
                if (result.error) return;

                setItems(prev => prev.filter(item => item.id !== itemId));
            });
    };

    return (
        <div className="playground" ref={playgroundRef} style={{
            backgroundImage: backgroundUrl ? `url("/assets/home/backgrounds/${backgroundUrl}")` : "none"
        }}>
            {items
                .map((item, index) => {
                    if (item.itemType === "backgrounds") return null;

                    return (
                        <HomeDraggableItem
                            key={item.id}
                            index={index}
                            restoreIndex={restoreIndex}
                            parentRef={playgroundRef}
                            homeItem={item}
                            homeType={homeType}
                            editMode={editMode}
                            bringToFront={bringToFront}
                            removeItem={removeItem}
                            setItems={setItems}
                            activeUser={activeUser}
                        />
                    );
                })
            }
        </div>
    );
};

export default HomePlayground;