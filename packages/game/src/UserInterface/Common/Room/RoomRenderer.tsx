import { useEffect, useRef, useState } from "react";
import ClientRoomRenderer from "@Client/Room/RoomRenderer";
import { RoomPositionData, RoomStructureData } from "@pixel63/events";
import { RoomRendererFurnitureProps } from "@UserInterface/Common/Room/Furniture/RoomRendererFurniture";
import RoomItem from "@Client/Room/Items/RoomItem";
import RoomFurnitureItem from "@Client/Room/Items/Furniture/RoomFurnitureItem";
import Furniture from "@Client/Furniture/Furniture";

export type RoomRendererProps = {
    hidden?: boolean;
    structure: RoomStructureData;
    furniture?: RoomRendererFurnitureProps[];
}

export default function RoomRenderer({ hidden, structure, furniture }: RoomRendererProps) {
    const elementRef = useRef<HTMLDivElement>(null);
    const roomRendererRequested = useRef<boolean>(false);
    const roomChildrenItems = useRef<Map<string, RoomItem>>(new Map());

    const [roomRenderer, setRoomRenderer] = useState<ClientRoomRenderer>();

    useEffect(() => {
        if(!elementRef.current) {
            return;
        }

        if(roomRendererRequested.current) {
            return;
        }

        roomRendererRequested.current = true;
        
        const renderer = new ClientRoomRenderer(elementRef.current, undefined, undefined, structure);

        renderer.addEventListener("render", () => {
            renderer.updatePreviewScale();
        });

        setRoomRenderer(renderer);

        return () => {
            roomRenderer?.terminate();
        };
    }, [elementRef]);

    useEffect(() => {
        if(!roomRenderer) {
            return;
        }

        roomRenderer.setStructure(structure);
    }, [roomRenderer, structure]);

    useEffect(() => {
        if(!roomRenderer) {
            return;
        }

        for(const [id, item] of roomChildrenItems.current.entries()) {
            if(!furniture?.some((furniture) => furniture.id === id)) {
                const index = roomRenderer.items.indexOf(item);

                if(index !== -1) {
                    roomRenderer.items.splice(index, 1);
                }

                roomChildrenItems.current.delete(id);
            }
        }

        for(const furnitureItem of furniture ?? []) {
            let item = roomChildrenItems.current.get(furnitureItem.id);

            if(!item) {
                item = new RoomFurnitureItem(
                    roomRenderer, 
                    new Furniture(furnitureItem.furniture.type, 64, undefined, undefined, furnitureItem.furniture.color),
                    furnitureItem.position
                );

                roomRenderer.items.push(item);

                roomChildrenItems.current.set(furnitureItem.id, item);
            }
            else {
                item.position = furnitureItem.position;
            }

            if(!furnitureItem.position) {
                if(item instanceof RoomFurnitureItem) {
                    item.furnitureRenderer.getData().then((data) => {
                        const position = (data.visualization.placement === "wall") ? (
                            RoomPositionData.create({
                                row: 1 + Math.max(1, item.furnitureRenderer.getDimensions(true).row),
                                column: 0,
                                depth: 1.5
                            })
                        ):(
                            RoomPositionData.create({
                                row: 1,
                                column: 1,
                                depth: 0
                            })
                        );

                        item.position = position;

                        if(furnitureItem.panToItem) {
                            if(item.furnitureRenderer.placement === "floor") {
                                roomRenderer.panToItem(item, {
                                    left: 0,
                                    top: 0
                                });
                            }
                            else {
                                roomRenderer.panToItem(item, {
                                    left: (Math.max(1, item.position?.row ?? 0) * 16),
                                    top: (item.position?.depth ?? 0) * 32
                                });
                            }
                        }
                    });
                }
            }
        }
    }, [roomRenderer, furniture]);

    return (
        <div ref={elementRef} style={{
            height: "100%",
            width: "100%",

            opacity: (hidden)?(0):(1)
        }}/>
    );
}