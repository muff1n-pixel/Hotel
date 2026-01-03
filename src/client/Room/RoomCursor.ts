import RoomRenderer from "./Renderer";

export default class RoomCursor {
    constructor(private readonly renderer: RoomRenderer) {
        this.renderer.addEventListener("render", this.render.bind(this));
    }

    private render() {
        const entity = this.renderer.getItemAtPosition();

        if(!entity) {
            return;
        }
    }
}
