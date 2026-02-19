import { FurnitureData } from "@Shared/Interfaces/Room/RoomFurnitureData";
import FurnitureIcon from "../../Furniture/FurnitureIcon";
import { useEffect, useRef } from "react";
import { MousePosition } from "@Client/Interfaces/MousePosition";

export type FlyingFurnitureIconData = {
    id: string;
    furniture: FurnitureData;

    position: MousePosition;
    targetElementId: string;
};

export type FlyingFurnitureIconProps = {
    data: FlyingFurnitureIconData;
    onFinish: () => void;
};

export default function FlyingFurnitureIcon({ data, onFinish }: FlyingFurnitureIconProps) {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(!elementRef.current) {
            return;
        }

        const targetElement = document.getElementById(data.targetElementId);

        if(!targetElement) {
            throw new Error("Target element does not exist.");
        }

        elementRef.current.style.left = `${data.position.left}px`;
        elementRef.current.style.top = `${data.position.top}px`;

        elementRef.current.style.transition = "transform 1s cubic-bezier(.25, .6, .3, 1)";

        const targetRectangle = targetElement.getBoundingClientRect();

        const destinationX = targetRectangle.left - data.position.left + (targetRectangle.width / 2);
        const destinationY = targetRectangle.top - data.position.top + (targetRectangle.height / 2);

        elementRef.current.addEventListener("transitionend", () => {
            if(!elementRef.current) {
                return;
            }

            elementRef.current.style.display = "none";

            onFinish();
        });

        elementRef.current.style.transform = `translate(-50%, -50%) translate(${destinationX}px, ${destinationY}px)`;

    }, [elementRef]);

    return (
        <div ref={elementRef} style={{
            position: "absolute",

            zIndex: 10000000
        }}>
            <FurnitureIcon furnitureData={data.furniture}/>
        </div>
    );
}
