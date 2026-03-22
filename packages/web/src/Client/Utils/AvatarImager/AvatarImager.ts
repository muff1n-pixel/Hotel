
// TODO: add type declarations
//@ts-expect-error

import { FigureAssets, Figure, FigureWorkerMainThread } from "@pixel63/game";

const AvatarImager = (figureConfiguration: object, direction: number = 2, actions: string[] = [], frame: number = 0, headOnly: boolean = false): Promise<Base64URLString> => {
    return new Promise((resolve, reject) => {
        FigureAssets.loadAssets().then(() => {
            const figure = new Figure(figureConfiguration, direction, actions, frame, headOnly);

            figure.renderToCanvas(new FigureWorkerMainThread(), 0, true).then(({ figure }: any) => {
                const canvas = document.createElement("canvas"),
                    ctx = canvas.getContext("2d");

                if (!ctx) {
                    reject(new Error(`Failed to load avatar imager (can't resolve context).`));
                    return;
                }

                canvas.width = figure.image.width;
                canvas.height = figure.image.height;

                ctx.drawImage(figure.image, 0, 0);
                resolve(canvas.toDataURL("image/png"));
            }).catch((e: any) => {
                reject(new Error(`Failed to load avatar imager: ${e.toString()}.`));
            })
        }).catch((e: any) => {
            reject(new Error(`Failed to load avatar imager: ${e.toString()}.`));
        });
    });
}

export default AvatarImager;