import PetAssets from "@Client/Assets/PetAssets";
import { FurniturePalette } from "@Client/Interfaces/Furniture/FurniturePalette";
import { useEffect, useState } from "react";
import Selection from "../Form/Selection";

export type PetPaletteSelectionProps = {
    type: string;
    tags: string[];
    breed: number | null;

    value: number;
    onChange: (value: number) => void;
};

export default function PetPaletteSelection({ value, onChange, type, breed, tags }: PetPaletteSelectionProps) {
    const [palettes, setPalettes] = useState<FurniturePalette[]>([]);

    useEffect(() => {
        PetAssets.getData(type).then((data) => {
            setPalettes(data.palettes?.filter((palette) => (!breed || !palette.breed || palette.breed === breed) && ((!palette.tags || palette.tags.some((tag) => tags.includes(tag))))) ?? []);
        });
    }, [ type, tags ]);

    return (
        <Selection value={value} items={palettes.map((palette) => {
            return {
                value: palette.id,
                label: (
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 5,

                        alignItems: "center"
                    }}>
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
                        
                        <div>{palette.id}</div>
                    </div>
                )
            };
        })} onChange={onChange}/>
    );
}
