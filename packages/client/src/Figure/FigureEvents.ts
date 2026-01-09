import FigureAssets from "@/Assets/FigureAssets.js";
import type { TypedEventTarget } from "@/Interfaces/TypedEventTarget.js";
import ClientFigureDataRequest from "@shared/interfaces/requests/ClientFigureDataRequest.js";
import ClientFigureDataResponse from "@shared/interfaces/responses/ClientFigureDataResponse.js";
import FigureRenderer from "./FigureRenderer.js";

export default function registerFigureEvents(internalEventTarget: TypedEventTarget) {
    internalEventTarget.addEventListener<ClientFigureDataRequest>("ClientFigureDataRequest", async (event) => {
        const settype = FigureAssets.figuredata.settypes.find((settype) => settype.type === event.part);

        if(!settype) {
            return;
        }

        console.log(event);

        const imagePromises = await Promise.allSettled(
            settype.sets.filter((set) => set.selectable && (set.gender === 'U' || (set.gender === 'M' && event.gender === "male") || (set.gender === 'F' && event.gender === "female"))).map(async (set) => {
                const figureRenderer = new FigureRenderer([
                    {
                        type: settype.type,
                        setId: set.id,
                    }
                ], 2);

                const { image } = await figureRenderer.renderToCanvas(0, true);

                return {
                    image: image,
                    setId: set.id,
                };
            })
        );


        const items = imagePromises.filter((promise) => promise.status === "fulfilled").map((promise) => promise.value);

        const palette = FigureAssets.figuredata.palettes.find((palette) => palette.id === settype.paletteId);

        const colors = palette?.colors.map((color) => {
            return {
                id: color.id,
                color: color.color
            };
        }) ?? [];

        internalEventTarget.dispatchEvent(new ClientFigureDataResponse(event.id, items, colors));
    });
}
