import FurnitureAssets from "@Client/Assets/FurnitureAssets";
import { FurnitureTraxEditorData } from "@pixel63/events";
import { useCallback, useEffect, useRef, useState } from "react";

export default function useTrax(trax: FurnitureTraxEditorData, setStep: (index: number) => void) {
    const [playing, setPlaying] = useState(false);
    const [paused, setPaused] = useState(false);

    const context = useRef<AudioContext>(undefined);
    const timer = useRef<NodeJS.Timeout>(undefined);
    const duration = useRef<number>(undefined);

    const handleStop = useCallback(() => {
        console.debug("Stopping playback!");

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
    }, [context, timer]);

    const buildAudioContext = useCallback(async () => {
        if(context.current) {
            console.error("An audio context already exists!");

            return null;
        }

        const audioContext = new AudioContext();
        audioContext.suspend();

        const allFurniture = await Promise.all(trax.sets.map((set) => FurnitureAssets.getFurnitureData(set.furniture!.type)));
        
        let maxDuration: number = 0;

        await Promise.allSettled(trax.slots.map((slot) => {
            return new Promise<void>((resolve, reject) => {
                const set = trax.sets.find((set) => set.index === slot.set);
                
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

                    source.connect(audioContext.destination);

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
    }, [context, trax]);

    const handleStart = useCallback(() => {
        if(context.current) {
            handleStop();
        }
        
        buildAudioContext().then((result) => {
            if(!result) {
                return;
            }
            
            context.current = result.audioContext;
            duration.current = result.duration;

            setPlaying(true);
            setPaused(false);

            setStep(0);

            context.current.resume();

            if(timer.current === undefined) {
                timer.current = setInterval(() => {
                    if(context.current === undefined) {
                        return;
                    }

                    if(duration.current === undefined) {
                        return;
                    }

                    if(context.current.state === "running") {
                        setStep(Math.floor(context.current.currentTime / 2));
                    }

                    if(context.current.currentTime > duration.current) {
                        handleStop();
                    }
                }, 1000);
            }
        });
    }, [trax, context, timer, handleStop]);

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
        playing,
        paused,

        handleStart,
        handlePause,
        handleStop
    };
}
