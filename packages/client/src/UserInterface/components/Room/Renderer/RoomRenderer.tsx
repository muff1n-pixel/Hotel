import { CSSProperties, Ref, useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../../contexts/AppContext";
import CreateRoomRendererEvent, { RoomRendererProperties, RoomRendererResult } from "@Shared/Events/Room/Renderer/CreateRoomRendererEvent";

export type RoomRendererProps = {
    style?: CSSProperties;
    options?: RoomRendererProperties;
    furnitureData?: {
        type: string;
        size?: number;
        direction?: number;
        animation?: number;
        color?: number;
    };
};

export default function RoomRenderer({ style, options, furnitureData }: RoomRendererProps) {
    const { internalEventTarget } = useContext(AppContext);

    const roomRef = useRef<HTMLDivElement>(null);
    const roomRendererRequested = useRef<boolean>(false);
    const [roomRendererResult, setRoomRendererResult] = useState<RoomRendererResult>();

    useEffect(() => {
        if(!roomRef.current) {
            return;
        }

        if(roomRendererRequested.current) {
            return;
        }

        roomRendererRequested.current = true;

        const requestEvent = new CreateRoomRendererEvent(roomRef.current, options ?? {}, (RoomRendererResult) => {
            setRoomRendererResult(RoomRendererResult);
        });

        internalEventTarget.dispatchEvent(requestEvent);
    }, [roomRef]);

    useEffect(() => {
        if(!roomRendererResult || !furnitureData) {
            return;
        }

        roomRendererResult.setFurniture(furnitureData.type, furnitureData.size ?? 64, furnitureData.direction, furnitureData.animation ?? 0, furnitureData.color ?? 0);
    }, [roomRendererResult, furnitureData]);

    useEffect(() => {
        if(!roomRendererResult) {
            return;
        }

        return () => {
            roomRendererResult.terminate();
        };
    }, [roomRendererResult]);

    return (
        <div ref={roomRef} style={style}/>
    );
}
