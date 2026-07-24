import RoomRenderer from "@Client/Room/RoomRenderer";
import LandscapeRenderer from "@Client/Room/Structure/LandscapeRenderer";

export default class RoomLandscape {
    private readonly renderer: LandscapeRenderer;

    public image?: OffscreenCanvas;

    constructor(private readonly roomRenderer: RoomRenderer) {
        this.renderer = new LandscapeRenderer(roomRenderer.structure, roomRenderer.size);
    }

    public async render() {
        this.image = await this.renderer.renderOffScreen();
    }
}
