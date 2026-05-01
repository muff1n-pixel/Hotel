import { CSSProperties, ReactNode, useEffect, useRef } from "react";
import WiredSection from "./WiredSection";
import { useRoomInstance } from "../../../../Hooks/useRoomInstance";
import RoomClickEvent from "@Client/Events/RoomClickEvent";
import RoomFurnitureItem from "@Client/Room/Items/Furniture/RoomFurnitureItem";
import { AssetSpriteGrayscaledProperties } from "@Client/Assets/AssetFetcher";

export type WiredFurniturePickerProps = {
    label?: string;
    enabled?: boolean;

    maxFurniture: number;
    restrictedToFurnitureTypes?: string[];

    value: string[];
    onChange: (value: string[]) => void;

    grayscale?: AssetSpriteGrayscaledProperties;

    children?: ReactNode;

    style?: CSSProperties;
};

export default function WiredFurniturePicker({ label, restrictedToFurnitureTypes, maxFurniture, value, onChange, enabled = true, grayscale = { foreground: "#999999", background: "#FFFFFF" }, children, style }: WiredFurniturePickerProps) {
    const room = useRoomInstance();

    const furnitureIds = useRef<string[]>(value);

    useEffect(() => {
        if(furnitureIds.current === null) {
            return;
        }

        if(!room?.roomRenderer.cursor) {
            return;
        }

        furnitureIds.current = furnitureIds.current.filter((furnitureId) => room.furnitures.some((furniture) => furniture.data.id === furnitureId));

        // remove furniture that are no longer in the room
        onChange(furnitureIds.current);

        for(const furnitureId of furnitureIds.current) {
            const furniture = room.getFurnitureById(furnitureId);

            furniture.furniture.grayscaled = grayscale;
        }

        const listener = (event: Event) => {
            if(!enabled) {
                return;
            }

            if(!(event instanceof RoomClickEvent)) {
                return;
            }

            if(!(event.otherEntity?.item instanceof RoomFurnitureItem)) {
                return;
            }

            const furniture = room.getFurnitureByItem(event.otherEntity.item);

            if(restrictedToFurnitureTypes && furniture.furnitureData && !restrictedToFurnitureTypes.includes(furniture.furnitureData.type)) {
                return;
            }

            if(furnitureIds.current.includes(furniture.data.id)) {
                furniture.furniture.grayscaled = undefined;

                furnitureIds.current = furnitureIds.current.filter((furnitureId) => furnitureId !== furniture.data.id);
                onChange(furnitureIds.current);
            }
            else {
                if(furnitureIds.current.length < maxFurniture) {
                    furniture.furniture.grayscaled = grayscale;
                    
                    furnitureIds.current = [...furnitureIds.current, furniture.data.id];
                    onChange(furnitureIds.current);
                }
            }
        };

        room.roomRenderer.cursor.addEventListener("click", listener);

        return () => {
            room.roomRenderer.cursor?.removeEventListener("click", listener);

            for(const furnitureId of furnitureIds.current) {
                const furniture = room.getFurnitureById(furnitureId);

                furniture.furniture.grayscaled = undefined;
            }
        };
    }, [room, furnitureIds, maxFurniture, restrictedToFurnitureTypes, grayscale, enabled, onChange]);

    return (
        <WiredSection style={style}>
            <b>{label ?? "Pick furnis"} [{value.length}/{maxFurniture}]</b>

            <div>You must pick one or more furnis for this entry. You can select or deselect a furni in your room by clicking / tapping it.</div>

            {children}
        </WiredSection>
    );
}
