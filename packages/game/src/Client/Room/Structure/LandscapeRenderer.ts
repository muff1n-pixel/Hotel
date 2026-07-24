import ContextNotAvailableError from "@Client/Exceptions/ContextNotAvailableError";
import RoomStructure from "@Client/Room/Structure/RoomStructure";

export default class LandscapeRenderer {
    private fullSize: number;
    private halfSize: number;

    constructor(public readonly structure: RoomStructure, public readonly size: number) {
        this.fullSize = this.size / 2;
        this.halfSize = this.fullSize / 2;
    }

    public async renderOffScreen() {
        const width = (this.structure.rows * this.fullSize) + (this.structure.columns * this.fullSize);
        const height = (this.structure.rows * this.halfSize) + (this.structure.columns * this.halfSize) + (this.structure.wallDepth * this.fullSize) + (this.size * 2);

        const canvas = new OffscreenCanvas(width, height);

        const context = canvas.getContext("2d");

        if(!context) {
            throw new ContextNotAvailableError();
        }

        context.imageSmoothingEnabled = false;

        context.fillStyle = "#84CEEF";
        context.fillRect(0, 0, canvas.width, canvas.height);

        return canvas;
    }
}
