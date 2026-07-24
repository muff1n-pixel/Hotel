import RoomItem from "@Client/Room/Items/RoomItem";
import RoomLandscapeDebugSprite from "@Client/Room/Landscape/RoomLandscapeDebugSprite";
import RoomRenderer from "@Client/Room/RoomRenderer";
import LandscapeRenderer from "@Client/Room/Structure/LandscapeRenderer";

export default class RoomLandscape {
    private readonly renderer: LandscapeRenderer;

    public image?: OffscreenCanvas;
    private frame: number = 0;

    private item?: RoomItem;
    private sprite?: RoomLandscapeDebugSprite;

    constructor(private readonly roomRenderer: RoomRenderer) {
        this.renderer = new LandscapeRenderer(roomRenderer.structure, roomRenderer.size);

        roomRenderer.clientInstance?.settings.subscribe((settings) => {
            if(settings.debugRoomLandscapes) {
                this.createSprite();
            }
            else {
                this.deleteSprite();
            }
        });
    }

    public async render() {
        this.frame = (this.frame + 1) % 24;

        if(this.image && (this.frame % 2) === 0) {
            return;
        }

        this.image = await this.renderer.renderOffScreen();

        this.sprite?.updateLandscape();
    }

    public createSprite() {
        if(this.item) {
            return;
        }

        this.item = new RoomItem(this.roomRenderer, "landscape");
        
        this.sprite = new RoomLandscapeDebugSprite(this.item);
        this.item.setSprites([ this.sprite ]);

        this.roomRenderer.addItem(this.item);
    }

    public deleteSprite() {
        if(!this.item) {
            return;
        }

        this.roomRenderer.removeItem(this.item);

        this.item = undefined;
    }
}
