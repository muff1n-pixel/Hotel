import FigureAssets from "@/Assets/FigureAssets.js";
import type { TypedEventTarget } from "@/Interfaces/TypedEventTarget.js";
import ClientFigureDataRequest from "@shared/events/requests/ClientFigureDataRequest.js";
import ClientFigureDataResponse from "@shared/events/responses/ClientFigureDataResponse.js";
import FigureRenderer from "../FigureRenderer.js";

export default function registerFigureEvents(internalEventTarget: TypedEventTarget) {
    internalEventTarget.addEventListener<ClientFigureDataRequest>("ClientFigureDataRequest", async (event) => {
        const settype = FigureAssets.figuredata.settypes.find((settype) => settype.type === event.part);

        if(!settype) {
            return;
        }

        const imagePromises = await Promise.allSettled(
            settype.sets.filter((set) => set.selectable && (set.gender === 'U' || (set.gender === 'M' && event.gender === "male") || (set.gender === 'F' && event.gender === "female"))).map(async (set) => {
                const figureRenderer = new FigureRenderer([
                    {
                        type: settype.type,
                        setId: set.id,
                    }
                ], 2);

                const image = new Promise<OffscreenCanvas>((resolve, reject) => {
                    figureRenderer.renderToCanvas(0, true).then(({ image }) => resolve(image as any as OffscreenCanvas)).catch(reject);
                });

                return {
                    image,
                    setId: set.id,
                    colorable: set.colorable,
                };
            })
        );


        const items = imagePromises.filter((promise) => promise.status === "fulfilled").map((promise) => promise.value);

        const palette = FigureAssets.figuredata.palettes.find((palette) => palette.id === settype.paletteId);

        const colors = palette?.colors.sort((a, b) => a.index - b.index).map((color) => {
            return {
                id: color.id,
                color: color.color
            };
        }) ?? [];

        internalEventTarget.dispatchEvent(new ClientFigureDataResponse(event.id, items, colors, settype.mandatoryGender[event.gender][0]));
    });
}
