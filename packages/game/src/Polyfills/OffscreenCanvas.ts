export { };

declare global {
    interface Window {
        OffscreenCanvas?: typeof OffscreenCanvas;
    }
}

if (typeof window !== 'undefined') {
    //if (!window.OffscreenCanvas) {
        class OffscreenCanvasPolyfill {
            private canvas: HTMLCanvasElement;

            constructor(width: number, height: number) {
                this.canvas = document.createElement('canvas');
                this.canvas.width = width;
                this.canvas.height = height;

                (this.canvas as unknown as ImageBitmap).close = () => { };
                (this.canvas as unknown as OffscreenCanvas).transferToImageBitmap = () => {
                    return this.canvas as unknown as ImageBitmap
                };

                (this.canvas as unknown as any).getContext2 = this.canvas.getContext;

                (this.canvas as unknown as any).getContext = () => {
                    const context = (this.canvas as any).getContext2("2d");

                    (context as any).reset = () => {
                        context?.resetTransform();
                    };

                    return context;
                };

                return this.canvas as unknown as OffscreenCanvasPolyfill;
            }
        }

        window.OffscreenCanvas =
            OffscreenCanvasPolyfill as unknown as typeof OffscreenCanvas;
    //}
}
