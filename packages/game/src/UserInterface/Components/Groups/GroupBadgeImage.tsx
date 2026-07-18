import { useEffect, useState } from "react";
import OffscreenCanvasRender from "../../Common/OffscreenCanvas/OffscreenCanvasRender";
import { GroupBadgeData } from "@pixel63/events";
import GroupBadgeRenderer from "@Client/Groups/GroupBadgeRenderer";

export type GroupBadgeImageProps = {
    scale?: number;
    data?: GroupBadgeData;
}

export default function GroupBadgeImage({ scale, data }: GroupBadgeImageProps) {
    const [image, setImage] = useState<ImageBitmap>();

    useEffect(() => {
        if(!data) {
            return;
        }

        const groupBadgeRenderer = new GroupBadgeRenderer();

        groupBadgeRenderer.renderOffScreen(data).then((image) => {
            setImage(image);
        });
    }, [ data ]);

    if(!image) {
        return;
    }

    return (
        <OffscreenCanvasRender offscreenCanvas={image} scale={scale}/>
    );
}
