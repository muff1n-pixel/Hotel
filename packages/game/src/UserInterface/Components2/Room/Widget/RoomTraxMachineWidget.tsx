import { FurnitureTraxSongMetaData } from "@pixel63/events";
import FlexLayout from "@UserInterface/Common/Layouts/FlexLayout";
import useTraxPlayer from "@UserInterface/Components2/Room/Widget/Hooks/useTraxPlayer";
import { useRoomTraxmachine } from "@UserInterface/Hooks/useRoomTraxmachine";
import { useCallback, useEffect, useRef, useState } from "react";

export default function RoomTraxMachineWidget() {
    const traxmachine = useRoomTraxmachine();
    const traxPlayer = useTraxPlayer();

    const manuallyStopped = useRef<boolean>(false);

    const index = useRef<number>(0);

    const [currentSong, setCurrentSong] = useState<FurnitureTraxSongMetaData>();

    const handleFinish = useCallback(() => {
        console.log("Finish");

        if(!traxmachine) {
            return;
        }

        index.current++;

        if(!traxmachine?.data.data?.trax?.playlist[index.current]) {
            index.current = 0;
        }

        const songId = traxmachine?.data.data?.trax?.playlist[index.current];

        if(!songId) {
            console.error("Could not find any song at index ", index.current);

            return;
        }

        const song = traxmachine.data.data?.trax?.songs.find((song) => song.id === songId);

        setCurrentSong(song);

        if(!song) {
            return;
        }

        if(manuallyStopped.current) {
            return;
        }

        traxPlayer.handleStart(song, handleFinish);
    }, [traxmachine]);

    useEffect(() => {
        if(!traxmachine) {
            return;
        }

        index.current = 0;

        const songId = traxmachine?.data.data?.trax?.playlist[index.current];

        if(!songId) {
            console.error("Could not find any song at index ", index.current);

            return;
        }

        const song = traxmachine.data.data?.trax?.songs.find((song) => song.id === songId);

        setCurrentSong(song);
        
        if(!song) {
            return;
        }

        if(manuallyStopped.current) {
            return;
        }

        traxPlayer.handleStart(song, handleFinish);

        return () => {
            traxPlayer.handleStop(false);
        };
    }, [traxmachine]);

    if(!traxmachine) {
        return null;
    }

    return (
        <div style={{
            borderRadius: 6,

            pointerEvents: "auto",

            border: "2px solid rgba(61, 61, 61, .95)",
            background: "rgba(0, 0, 0, 0.64)",

            width: 220,
            boxSizing: "border-box",

            alignSelf: "flex-end",

            fontSize: 12,
            color: "white",

            display: "flex",
            flexDirection: "column"
        }}>
            <div style={{
                padding: "5px 8px 8px",
                background: "rgba(61, 61, 61, .95)",
                fontSize: 13,

                textAlign: "center",

                position: "relative"
            }}>
                <b>{traxmachine.furnitureData.name}</b>

                <FlexLayout direction="row" align="center" style={{
                    position: "absolute",

                    right: 6,
                    top: 0,
                    bottom: 2
                }}>
                    {(traxPlayer.playing && !traxPlayer.paused && (traxPlayer.audioContext?.state === "running" || traxPlayer.currentDuration !== undefined))?(
                        <div className="sprite_widget_pause" style={{ cursor: "pointer" }} onClick={() => {
                            manuallyStopped.current = true;
                            
                            traxPlayer.handlePause();
                        }}/>
                    ):(
                        <div className="sprite_widget_play" style={{ cursor: "pointer" }} onClick={() => {
                            manuallyStopped.current = false;

                            if(currentSong) {
                                if(traxPlayer.paused) {
                                    traxPlayer.handlePause();
                                }
                                else {
                                    traxPlayer.handleStart(currentSong, handleFinish);
                                }
                            }
                        }}/>
                    )}
                </FlexLayout>
            </div>

            <FlexLayout direction="row" style={{
                padding: "8px 16px 8px 8px",
            }}>
                <FlexLayout align="center" justify="center">
                    <img src={"/assets/widgets/music.png"}/>
                </FlexLayout>

                <FlexLayout flex={1} justify="space-between" gap={2} style={{
                    padding: "2px 0"
                }}>
                    <div>
                        <div><b>Now playing:</b></div>
                        <div>{currentSong?.name}</div>
                    </div>

                    {(traxPlayer.duration.current !== undefined && traxPlayer.currentDuration !== undefined) && (
                        <div style={{ color: "#888888" }}>{new Date(traxPlayer.currentDuration * 1000).toISOString().slice(14, 19)} / {new Date(traxPlayer.duration.current * 1000).toISOString().slice(14, 19)} min</div>
                    )}
                </FlexLayout>
            </FlexLayout>
        </div>
    );
}
