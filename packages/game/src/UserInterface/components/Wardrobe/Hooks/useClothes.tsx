import FigureWardrobe from "@Client/Figure/Wardrobe/FigureWardrobe";
import { FiguredataData } from "@Client/Interfaces/Figure/FiguredataData";
import { GetUserClothesData, UserClothesData, UserClothingUnlockedData } from "@pixel63/events";
import { useEffect, useMemo, useRef, useState } from "react";
import { webSocketClient } from "src";
import { FigureAssets } from "src/library";

function filterAndSortSets(sets: (FiguredataData["settypes"][0]["sets"][0] | undefined)[] | undefined, gender: string) {
    return sets?.filter((set) => set !== undefined)
            .filter((set) => FigureWardrobe.filterSetGender(set, gender))
            .sort((a, b) => parseInt(a.id) - parseInt(b.id)) ?? [];
}

export default function useClothes(part: string, gender: string) {
    const partRequested = useRef<string>(null);

    const [data, setData] = useState<UserClothesData>();

    const mandatory = useMemo(() => {
        const settype = FigureAssets.figuredata.settypes.find((setType) => setType.type === part);

        return settype?.mandatoryGender[gender as "male" | "female"][0];
    }, [part, gender]);

    const colors = useMemo(() => {
        const settype = FigureAssets.figuredata.settypes.find((setType) => setType.type === part);

        const palette = FigureAssets.figuredata.palettes.find((palette) => palette.id === settype?.paletteId);

        const paletteColors = palette?.colors.sort((a, b) => a.index - b.index).map((color) => {
            return {
                id: color.id,
                color: color.color
            };
        }) ?? [];

        return paletteColors;
    }, [part, gender]);

    const allSets = useMemo(() => {
        const settype = FigureAssets.figuredata.settypes.find((setType) => setType.type === part);
        
        return filterAndSortSets(settype?.sets, gender);
    }, [part, gender]);

    const sets = useMemo(() => {
        const settype = FigureAssets.figuredata.settypes.find((setType) => setType.type === part);
        const sets = data?.clothes.map((clothing) => {
            return settype?.sets.find((set) => set.id === clothing.setId);
        });

        console.log(sets);
        
        return filterAndSortSets(sets, gender);
    }, [data, part, gender]);

    const userSets = useMemo(() => {
        const settype = FigureAssets.figuredata.settypes.find((setType) => setType.type === part);
        const sets = data?.userClothes.map((clothing) => {
            return settype?.sets.find((set) => set.id === clothing.setId);
        });
        
        return filterAndSortSets(sets, gender);
    }, [data, part, gender]);

    useEffect(() => {
        if(partRequested.current === part) {
            return;
        }

        partRequested.current = part;

        webSocketClient.sendProtobuff(GetUserClothesData, GetUserClothesData.create({
            part
        }));
    }, [part]);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(UserClothesData, {
            async handle(payload: UserClothesData) {
                if(payload.part !== part) {
                    return;
                }

                setData(payload);
            },
        });

        return () => {
            webSocketClient.removeProtobuffListener(UserClothesData, listener);
        };
    }, [part]);

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(UserClothingUnlockedData, {
            async handle() {
                webSocketClient.sendProtobuff(GetUserClothesData, GetUserClothesData.create({
                    part
                }));
            },
        });

        return () => {
            webSocketClient.removeProtobuffListener(UserClothingUnlockedData, listener);
        };
    }, [part]);

    return {
        sets,
        userSets,

        allSets,

        colors,
        mandatory
    };
}