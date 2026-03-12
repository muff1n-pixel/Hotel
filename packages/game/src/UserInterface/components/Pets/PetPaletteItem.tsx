import PetAssets from "@Client/Assets/PetAssets";
import { PetPaletteData } from "@pixel63/events";
import { useEffect, useState } from "react";

export type PetPaletteItemProps = {
    type: string;
    palette: PetPaletteData;
};

export default function PetPaletteItem({ type, palette }: PetPaletteItemProps) {
    const [colors, setColors] = useState<string[]>([]);

    useEffect(() => {
        if(palette.color) {
            setColors([palette.color]);

            return;
        }

        PetAssets.getData(type).then((data) => {
            const paletteData = data.palettes?.find((_palette) => _palette.id === palette.paletteId);

            setColors([paletteData?.color1, paletteData?.color2].filter<string>((value) => typeof value === "string"));
        });
    }, [ type, palette ]);

    return (
        (palette) && (
            <div style={{
                width: 14,
                height: 14,

                display: "flex",
                flexDirection: "row",
            }}>
                {colors.map((color) => (
                    <div key={color} style={{ flex: 1, background: color }}/>
                ))}
            </div>
        )
    );
}
