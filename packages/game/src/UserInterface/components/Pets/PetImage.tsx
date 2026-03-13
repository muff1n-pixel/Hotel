import { useEffect, useState } from "react";
import OffscreenCanvasRender from "../../Common/OffscreenCanvas/OffscreenCanvasRender";
import Pet from "@Client/Pets/Pet";
import { PetData } from "@pixel63/events";

export type PetImageProps = {
    data?: PetData;
    headOnly?: boolean;
}

export default function PetImage({ data, headOnly }: PetImageProps) {
    const [image, setImage] = useState<ImageBitmap>();

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
        <OffscreenCanvasRender offscreenCanvas={image}/>
    );
}
