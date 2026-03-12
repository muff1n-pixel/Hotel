import PetAssets from "@Client/Assets/PetAssets";
import { FurniturePalette } from "@Client/Interfaces/Furniture/FurniturePalette";
import { useEffect, useState } from "react";

export type PetPaletteItemProps = {
    type: string;
    paletteId: number;
};

export default function PetPaletteItem({ type, paletteId }: PetPaletteItemProps) {
    const [palette, setPalette] = useState<FurniturePalette | null>(null);

    useEffect(() => {
        PetAssets.getData(type).then((data) => {
            setPalette(data.palettes?.find((palette) => palette.id === paletteId) ?? null);
        });
    }, [ type, paletteId ]);

    return (
        (palette) && (
            <div style={{
                width: 14,
                height: 14,

                display: "flex",
                flexDirection: "row",
            }}>
                {[palette.color1, palette.color2].filter(Boolean).map((color) => (
                    <div key={color} style={{ flex: 1, background: color }}/>
                ))}
            </div>
        )
    );
}
