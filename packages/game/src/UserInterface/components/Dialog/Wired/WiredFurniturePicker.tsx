import { useEffect, useRef } from "react";
import WiredSection from "./WiredSection";
import { useRoomInstance } from "../../../hooks/useRoomInstance";
import RoomClickEvent from "@Client/Events/RoomClickEvent";
import RoomFurnitureItem from "@Client/Room/Items/Furniture/RoomFurnitureItem";

export type WiredFurniturePickerProps = {
    value: string[];
    onChange: (value: string[]) => void;
};

export default function WiredFurniturePicker({ value, onChange }: WiredFurniturePickerProps) {
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

            furniture.furniture.grayscaled = true;
        }

        const listener = (event: Event) => {
            if(!(event instanceof RoomClickEvent)) {
                return;
            }

            if(!(event.otherEntity?.item instanceof RoomFurnitureItem)) {
                return;
            }

            const furniture = room.getFurnitureByItem(event.otherEntity.item);

            if(furnitureIds.current.includes(furniture.data.id)) {
                furniture.furniture.grayscaled = false;

                furnitureIds.current = furnitureIds.current.filter((furnitureId) => furnitureId !== furniture.data.id);
                onChange(furnitureIds.current);
            }
            else {
                if(furnitureIds.current.length < 5) {
                    furniture.furniture.grayscaled = true;
                    
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

                furniture.furniture.grayscaled = false;
            }
        };
    }, [room, furnitureIds, onChange]);

    return (
        <WiredSection>
            <b>Pick furnis [{value.length}/5]</b>

            <p>You must pick one or more furnis for this entry. You can select or deselect a furni in your room by clicking / tapping it.</p>
        </WiredSection>
    );
}
