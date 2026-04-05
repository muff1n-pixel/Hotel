import FurnitureAssets from "@Client/Assets/FurnitureAssets";
import { FurnitureTraxSongMetaData } from "@pixel63/events";
import { useCallback, useRef, useState } from "react";

export default function useTraxPlayer() {
    const [playing, setPlaying] = useState(false);
    const [paused, setPaused] = useState(false);

    const context = useRef<AudioContext>(undefined);
    const timer = useRef<NodeJS.Timeout>(undefined);
    const startedAt = useRef<number>(undefined);
    const handleFinish = useRef<() => void>(undefined);
    
    const duration = useRef<number>(0);

    const [currentDuration, setCurrentDuration] = useState<number>();

    const handleStop = useCallback(() => {
        console.debug("Stopping playback!");

        setCurrentDuration(undefined);

        if(context.current) {
            context.current.close();
            context.current = undefined;
        }

        if(timer.current !== undefined) {
            clearInterval(timer.current);
            timer.current = undefined;
        }

        setPlaying(false);
        setPaused(false);

        handleFinish.current?.();
    }, [context, timer]);

    const buildAudioContext = useCallback(async (data: FurnitureTraxSongMetaData) => {
        if(context.current) {
            console.error("An audio context already exists!");

            return null;
        }

        if(!data.song) {
            console.error("Song doesn't have any media!");

            return null;
        }

        const audioContext = new AudioContext();
        audioContext.suspend();

        const gainNode = audioContext.createGain();

        const allFurniture = await Promise.all(data.song.sets.map((set) => FurnitureAssets.getFurnitureData(set.furniture!.type)));
        
        let maxDuration: number = 0;

        await Promise.allSettled(data.song.slots.map((slot) => {
            return new Promise<void>((resolve, reject) => {
                if(!data.song) {
                    reject("Song does not have any media!");

                    return;
                }

                const set = data.song.sets.find((set) => set.index === slot.set);
                
                if(!set) {
                    reject("Set does not exist in the trax!");

                    return;
                }

                const furniture = allFurniture.find((furniture) => furniture.index.type === set.furniture?.type);

                if(!furniture) {
                    reject("Furniture does not exist!");

                    return;
                }

                const furnitureSound = furniture.sounds?.[slot.slot];

                if(!furnitureSound) {
                    reject("Sound does not exist in furniture!");

                    return;
                }

                FurnitureAssets.getFurnitureAudioBuffer(audioContext, furniture.index.type, furnitureSound.file).then((audioBuffer) => {
                    console.log("Adding buffer");

                    const source = audioContext.createBufferSource();
                    source.buffer = audioBuffer;

                    source.connect(gainNode);

                    gainNode.connect(audioContext.destination);
                    gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);

                    source.start(audioContext.currentTime + slot.column * 2);

                    if((slot.column + slot.duration) * 2 > maxDuration) {
                        maxDuration = (slot.column + slot.duration) * 2;
                    }

                    resolve();
                });
            });
        }));

        return {
            audioContext,
            duration: maxDuration
        };
    }, [context]);

    const handleStart = useCallback((song: FurnitureTraxSongMetaData, onFinish: () => void) => {
        if(context.current) {
            handleStop();
        }
        
        buildAudioContext(song).then((result) => {
            if(!result) {
                return;
            }
            
            handleFinish.current = onFinish;

            context.current = result.audioContext;
            duration.current = result.duration;
            startedAt.current = performance.now();

            setPlaying(true);
            setPaused(false);

            context.current.resume().then(() => {
                setCurrentDuration(0);
            });

            if(timer.current === undefined) {
                timer.current = setInterval(() => {
                    if(context.current === undefined) {
                        return;
                    }

                    if(duration.current === undefined) {
                        return;
                    }

                    if(context.current.state === "running") {
                        if(startedAt.current) {
                            setCurrentDuration((performance.now() - startedAt.current) / 1000);
                        }
                        else {
                            setCurrentDuration(context.current.currentTime);
                        }
                    }

                    if(context.current.currentTime > duration.current) {
                        handleStop();
                    }
                }, 1000);
            }
        });
    }, [context, timer, handleStop]);

    const handlePause = useCallback(() => {
        if(paused) {
            context.current?.resume();
        }
        else {
            context.current?.suspend();
        }

        setPaused(!paused);
    }, [paused]);

    return {
        audioContext: context.current,

        playing,
        paused,

        currentDuration,
        duration,

        handleStart,
        handlePause,
        handleStop
    };
}
