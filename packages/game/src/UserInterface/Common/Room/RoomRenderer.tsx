import { useEffect, useRef, useState } from "react";
import ClientRoomRenderer from "@Client/Room/RoomRenderer";
import { RoomPositionData, RoomStructureData, RoomStructureFloorData, RoomStructureLandscapeData, RoomStructureWallData } from "@pixel63/events";
import { RoomRendererFurnitureProps } from "@UserInterface/Common/Room/Furniture/RoomRendererFurniture";
import RoomItem from "@Client/Room/Items/RoomItem";
import RoomFurnitureItem from "@Client/Room/Items/Furniture/RoomFurnitureItem";
import Furniture from "@Client/Furniture/Furniture";
import { RoomRendererFigureProps } from "./Furniture/RoomRendererFigure";
import RoomFigureItem from "@Client/Room/Items/Figure/RoomFigureItem";
import { Figure } from "@Game/library";

export type RoomRendererProps = {
    hidden?: boolean;
    structure: RoomStructureData;
    furniture?: RoomRendererFurnitureProps[];
    figure?: RoomRendererFigureProps[];
}

export default function RoomRenderer({ hidden, structure, furniture, figure }: RoomRendererProps) {
    const elementRef = useRef<HTMLDivElement>(null);
    const roomRendererRequested = useRef<boolean>(false);
    const roomFurnitureItems = useRef<Map<string, RoomItem>>(new Map());
    const roomFigureItems = useRef<Map<string, RoomItem>>(new Map());

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

        renderer.init().then(() => {
            renderer.application.ticker.maxFPS = 24;
            
            setRoomRenderer(renderer);
        });
    }, [elementRef]);

    useEffect(() => {
        return () => {
            roomRenderer?.terminate();
        };
    }, [roomRenderer]);

    useEffect(() => {
        if(!roomRenderer || roomRenderer.terminated) {
            return;
        }

        for(const [id, item] of roomFurnitureItems.current.entries()) {
            if(!furniture?.some((furniture) => furniture.id === id)) {
                roomRenderer.removeItem(item);

                roomFurnitureItems.current.delete(id);
            }
        }

        for(const furnitureItem of furniture ?? []) {
            let item: RoomFurnitureItem = roomFurnitureItems.current.get(furnitureItem.id) as RoomFurnitureItem;

            if(!item) {
                if(furnitureItem.furniture.type === "floor") {
                    roomRenderer.setStructure({
                        ...roomRenderer.structure.data,
                        floor: RoomStructureFloorData.create({
                            ...roomRenderer.structure.data.floor,
                            id: furnitureItem.furniture.color?.toString()
                        })
                    });

                    continue;
                }
                else if(furnitureItem.furniture.type === "wallpaper") {
                    roomRenderer.setStructure({
                        ...roomRenderer.structure.data,
                        wall: RoomStructureWallData.create({
                            ...roomRenderer.structure.data.wall,
                            id: furnitureItem.furniture.color?.toString()
                        })
                    });

                    roomRenderer.panToOffset({
                        left: 0,
                        top: 32
                    });

                    continue;
                }
                else if(furnitureItem.furniture.type === "landscape") {
                    roomRenderer.setStructure({
                        ...roomRenderer.structure.data,
                        landscape: RoomStructureLandscapeData.create({
                            ...roomRenderer.structure.data.landscape,
                            id: furnitureItem.furniture.color?.toString()
                        })
                    });
                    
                    item = new RoomFurnitureItem(
                        roomRenderer, 
                        new Furniture('window_double_default', 64),
                        RoomPositionData.create({
                            row: -1,
                            column: 0,
                            depth: 1
                        })
                    );

                    roomRenderer.addItem(item);

                    roomFurnitureItems.current.set(furnitureItem.id, item);
                }
                else {
                    item = new RoomFurnitureItem(
                        roomRenderer, 
                        furnitureItem.furnitureRenderer ?? new Furniture(furnitureItem.furniture.type, 64, undefined, undefined, furnitureItem.furniture.color),
                        furnitureItem.position
                    );

                    roomRenderer.addItem(item);

                    roomFurnitureItems.current.set(furnitureItem.id, item);
                }
            }
            else {
                item.setPosition(furnitureItem.position);
            }
            
            item.furnitureRenderer.figureConfiguration = furnitureItem.figureConfiguration;
            item.furnitureRenderer.externalImage = furnitureItem.externalImage;
            item.furnitureRenderer.colorTags = furnitureItem.colorTags;
            item.furnitureRenderer.animation = furnitureItem.animationId ?? 0;

            //console.log("color tags set to", furnitureItem.colorTags);

            if(!furnitureItem.position) {
                if(item instanceof RoomFurnitureItem) {
                    item.furnitureRenderer.getData().then((data) => {
                        const position = (data.visualization.placement === "wall") ? (
                            RoomPositionData.create({
                                row: 2 + Math.max(1, Math.round(item.furnitureRenderer.getDimensions(true).row / 2)),
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

                        item.setPosition(position);
                    });
                }
            }
        }
    }, [roomRenderer, furniture]);

    useEffect(() => {
        if(!roomRenderer || roomRenderer.terminated) {
            return;
        }

        for(const [id, item] of roomFigureItems.current.entries()) {
            if(!figure?.some((figure) => figure.id === id)) {
                roomRenderer.removeItem(item);

                roomFigureItems.current.delete(id);
            }
        }

        for(const figureItem of figure ?? []) {
            let item: RoomFigureItem = roomFigureItems.current.get(figureItem.id) as RoomFigureItem;

            if(!item) {
                item = new RoomFigureItem(
                    roomRenderer,
                    new Figure(figureItem.figureConfiguration, 2, figureItem.actions),
                    figureItem.position
                );

                roomRenderer.addItem(item);

                roomFigureItems.current.set(figureItem.id, item);
            }
            else {
                item.setPosition(figureItem.position);
            }
            
            item.figureRenderer.configuration = figureItem.figureConfiguration;
            item.figureRenderer.setActions(figureItem.actions ?? []);
        }
    }, [roomRenderer, figure]);

    return (
        <div ref={elementRef} style={{
            height: "100%",
            width: "100%",

            opacity: (hidden)?(0):(1)
        }}/>
    );
}