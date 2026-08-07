import DataStats from "@Client/DataStats";
import RoomItem from "@Client/Room/Items/RoomItem";
import RoomLandscapeDebugSprite from "@Client/Room/Landscape/RoomLandscapeDebugSprite";
import RoomRenderer from "@Client/Room/RoomRenderer";
import LandscapeRenderer from "@Client/Room/Structure/LandscapeRenderer";
import RoomFurnitureItem from "../Items/Furniture/RoomFurnitureItem";
import { Texture } from "pixi.js";

export default class RoomLandscape {
    private renderer: LandscapeRenderer;

    private frame: number = 0;

    private item?: RoomItem;
    private sprite?: RoomLandscapeDebugSprite;

    public texture?: Texture;

    private settingsListener?: () => void;

    constructor(private readonly roomRenderer: RoomRenderer) {
        this.renderer = new LandscapeRenderer(roomRenderer.structure, roomRenderer.size);

        this.settingsListener = roomRenderer.clientInstance?.settings.subscribe((settings) => {
            if(settings.debugRoomLandscapes) {
                this.createSprite();
            }
            else {
                this.deleteSprite();
            }
        });
    }

    public destroy() {
        this.settingsListener?.();
    }

    public recreate() {
        this.renderer = new LandscapeRenderer(this.roomRenderer.structure, this.roomRenderer.size);
    }

    private rendering: boolean = false;

    public async render() {
        if(this.rendering) {
            return;
        }

        if(!this.roomRenderer.hasLandscapeMask()) {
            return;
        }

        this.rendering = true;

        this.frame = (this.frame + 1) % 24;

        const image = await this.renderer.renderOffScreen();

        const texture = Texture.from(image, true);
        texture.source.scaleMode = "nearest";

        for(const item of this.roomRenderer.getFilteredItems((item) => item instanceof RoomFurnitureItem && item.hasLandscapeMask)) {
            item.updateLandscapeMask(texture);
        }

        const previousTexture = this.texture;

        this.texture = texture;

        if(previousTexture) {
            previousTexture.destroy(true);
        }

        this.rendering = false;

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
