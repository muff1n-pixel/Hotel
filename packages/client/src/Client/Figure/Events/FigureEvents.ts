import FigureAssets from "@/Assets/FigureAssets.js";
import type { TypedEventTarget } from "@/Interfaces/TypedEventTarget.js";
import ClientFigureDataRequest from "@shared/events/requests/ClientFigureDataRequest.js";
import ClientFigureDataResponse from "@shared/events/responses/ClientFigureDataResponse.js";
import FigureRenderer from "../FigureRenderer.js";
import ClientFigureRequest from "@shared/events/requests/ClientFigureRequest.js";
import ClientFigureResponse from "@shared/events/responses/ClientFigureResponse.js";
import FigureConfigurationHelper from "@shared/figure/FigureConfigurationHelper.js";
import FigureWorker from "../Worker/FigureWorker.js";

export default function registerFigureEvents(internalEventTarget: TypedEventTarget) {
    internalEventTarget.addEventListener<ClientFigureDataRequest>("ClientFigureDataRequest", async (event) => {
        const settype = FigureAssets.figuredata.settypes.find((settype) => settype.type === event.part);

        if(!settype) {
            return;
        }

        const palette = FigureAssets.figuredata.palettes.find((palette) => palette.id === settype.paletteId);

        const figureWorker = new FigureWorker(true);

        const imagePromises = await Promise.allSettled(
            settype.sets.filter((set) => set.selectable && (set.gender === 'U' || (set.gender === 'M' && event.gender === "male") || (set.gender === 'F' && event.gender === "female"))).map(async (set) => {
                const figureRenderer = new FigureRenderer([
                    {
                        type: settype.type,
                        setId: set.id,
                        colorIndex: (set.colorable)?(event.colorId ?? palette?.colors[0].id):(undefined)
                    }
                ], 2);

                const image = new Promise<ImageBitmap>((resolve, reject) => {
                    figureRenderer.renderToCanvas(figureWorker, 0, true).then(({ image }) => resolve(image)).catch(reject);
                });

                return {
                    image,
                    setId: set.id,
                    colorable: set.colorable,
                };
            })
        );

        const items = imagePromises.filter((promise) => promise.status === "fulfilled").map((promise) => promise.value);

        const colors = palette?.colors.sort((a, b) => a.index - b.index).map((color) => {
            return {
                id: color.id,
                color: color.color
            };
        }) ?? [];

        internalEventTarget.dispatchEvent(new ClientFigureDataResponse(event.id, items, colors, settype.mandatoryGender[event.gender][0]));

        Promise.allSettled(items.map((item) => item.image)).then(() => {
            figureWorker.terminate();
        });
    });
    
    internalEventTarget.addEventListener<ClientFigureRequest>("ClientFigureRequest", (event) => {
        const configuration = (typeof event.configuration === "string")?(FigureConfigurationHelper.getConfigurationFromString(event.configuration)):(event.configuration);

        const figureRenderer = new FigureRenderer(configuration, event.direction);

        figureRenderer.renderToCanvas(FigureRenderer.figureWorker, 0).then(({ image }) => {
            internalEventTarget.dispatchEvent(new ClientFigureResponse(event.id, image));
        });
    });
}
