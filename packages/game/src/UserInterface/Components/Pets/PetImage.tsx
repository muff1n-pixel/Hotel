import { CSSProperties, useEffect, useState } from "react";
import OffscreenCanvasRender from "../../Common/OffscreenCanvas/OffscreenCanvasRender";
import Pet from "@Client/Pets/Pet";
import { PetData } from "@pixel63/events";

export type PetImageProps = {
    data?: PetData;
    headOnly?: boolean;
    style?: CSSProperties;
    scale?: number;
}

export default function PetImage({ data, headOnly, style, scale }: PetImageProps) {
    const [image, setImage] = useState<OffscreenCanvas>();

    useEffect(() => {
        if(!data?.type) {
            return;
        }

        const pet = new Pet(data.type, data.palettes, undefined, headOnly);

        pet.renderToCanvas({ spritesWithoutInkModes: true }).then((image) => {
            setImage(image);
        });
    }, [ data ]);

    if(!image) {
        return;
    }

    return (
        <OffscreenCanvasRender offscreenCanvas={image} style={style} scale={scale}/>
    );
}
