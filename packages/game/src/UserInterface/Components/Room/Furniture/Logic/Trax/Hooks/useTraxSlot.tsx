import FurnitureAssets from "@Client/Assets/FurnitureAssets";
import { FurnitureTraxSetData } from "@pixel63/events";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function useTraxSlot(containerRef: React.RefObject<HTMLDivElement | null>, slotRef: React.RefObject<HTMLDivElement | null>, handleSetSlot: (set: FurnitureTraxSetData, slot: number, length: number, row: number, column: number) => void) {
    const [set, setSet] = useState<FurnitureTraxSetData | null>(null);
    const [slot, setSlot] = useState<number | null>(null);
    const [length, setLength] = useState<number | null>(null);

    const dragging = useMemo(() => {
        return set !== null && slot !== null && length !== null;
    }, [set, slot, length]);

    useEffect(() => {
        if(!dragging) {
            return;
        }

        if(!slotRef.current) {
            return;
        }

        document.body.style.cursor = "grabbing";

        const mousemoveListener = (event: MouseEvent) => {
            if(!slotRef.current) {
                return;
            }

            slotRef.current.style.display = `flex`;

            slotRef.current.style.zIndex = performance.now().toString();

            const elements = document.elementsFromPoint(event.clientX, event.clientY);
            const closestColumnElement = elements.find((element) => element.classList.contains("sprite_dialog_trax_slot"));

            if(closestColumnElement) {
                const boundingClientRect = closestColumnElement.getBoundingClientRect();

                slotRef.current.style.left = `${boundingClientRect.left + 12}px`;
                slotRef.current.style.top = `${boundingClientRect.top + 12}px`;
            }
            else {
                slotRef.current.style.left = `${event.clientX}px`;
                slotRef.current.style.top = `${event.clientY}px`;
            }
        };

        const mouseupListener = (event: MouseEvent) => {
            document.body.style.cursor = "unset";

            const elements = document.elementsFromPoint(event.clientX, event.clientY);
            const closestColumnElement = elements.find((element) => element.classList.contains("sprite_dialog_trax_slot"));

            if(closestColumnElement) {
                console.log(closestColumnElement);
                const row = parseInt(closestColumnElement.getAttribute("data-trax-row") ?? "0");
                const column = parseInt(closestColumnElement.getAttribute("data-trax-slot") ?? "0");

                if(set !== null && slot !== null && length !== null) {
                    handleSetSlot(set, slot, length, row, column);
                }
            }

            setSet(null);
            setSlot(null);
            setLength(null);
        };

        window.addEventListener("mousemove", mousemoveListener);
        window.addEventListener("mouseup", mouseupListener);

        return () => {
            window.removeEventListener("mousemove", mousemoveListener);
            window.removeEventListener("mouseup", mouseupListener);
        };
    }, [dragging, slotRef.current]);

    const handleDragging = useCallback((set: FurnitureTraxSetData, slot: number) => {
        if(!set.furniture?.type) {
            return;
        }

        FurnitureAssets.getFurnitureData(set.furniture.type).then((data) => {
            const sound = data.sounds?.[slot];

            if(!sound) {
                console.error("Slot doesn't exist", slot);
                return;
            }

            console.log("Start!", set, slot, Math.ceil(sound.duration / 2));

            setSet(set);
            setSlot(slot);
            setLength(Math.ceil(sound.duration / 2));
        });
    }, []);

    return {
        set,
        slot,
        length,

        dragging,

        handleDragging
    };
}
