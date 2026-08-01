import RoomFloorItem from "@Client/Room/Items/Map/RoomFloorItem";
import RoomWallItem from "@Client/Room/Items/Map/RoomWallItem";
import RoomRenderer from "@Client/Room/RoomRenderer";
import { UserFurnitureMoodlightData, UserFurnitureTonerData } from "@pixel63/events";
import { Sprite, Texture } from "pixi.js";

export default class RoomLighting {
    private readonly MAX_DARKNESS = 0.75;

    public moodlight?: UserFurnitureMoodlightData;
    public backgroundToner?: UserFurnitureTonerData;

    private backgroundSprite: Sprite = new Sprite();
    private lightSprite: Sprite = new Sprite();

    constructor(private roomRenderer: RoomRenderer) {

    }

    public init() {
        this.backgroundSprite.texture = Texture.WHITE;

        this.backgroundSprite.tint = 0x00;

        this.backgroundSprite.interactive = true;

        this.backgroundSprite.addListener("click", () => {
            this.roomRenderer.focusedItem.value = null;
        });

        this.backgroundSprite.width = this.roomRenderer.application.screen.width;
        this.backgroundSprite.height = this.roomRenderer.application.screen.height;

        this.roomRenderer.application.renderer.on("resize", () => {
            this.backgroundSprite.width = this.roomRenderer.application.screen.width;
            this.backgroundSprite.height = this.roomRenderer.application.screen.height;
        });

        this.roomRenderer.application.stage.addChild(this.backgroundSprite);

        this.lightSprite.visible = false;

        this.lightSprite.texture = Texture.WHITE;

        this.lightSprite.tint = 0x00;

        this.lightSprite.zIndex = 1_000_000_001;

        this.lightSprite.width = this.roomRenderer.application.screen.width;
        this.lightSprite.height = this.roomRenderer.application.screen.height;
        
        this.roomRenderer.application.renderer.on("resize", () => {
            this.lightSprite.width = this.roomRenderer.application.screen.width;
            this.lightSprite.height = this.roomRenderer.application.screen.height;
        });

        this.roomRenderer.application.stage.addChild(this.lightSprite);
    }

    public setBackgroundTonerData(backgroundToner: UserFurnitureTonerData) {
        if(backgroundToner.enabled) {
            this.backgroundToner = backgroundToner;

            this.backgroundSprite.tint = backgroundToner.color;
        }
        else {
            this.backgroundToner = undefined;

            this.backgroundSprite.tint = 0x00;
        }
    }

    public setMoodlightData(moodlight?: UserFurnitureMoodlightData) {
        const shouldRerender = 
            (moodlight?.enabled !== this.moodlight?.enabled && this.moodlight?.backgroundOnly)
            || (moodlight?.backgroundOnly !== this.moodlight?.backgroundOnly)
            || (moodlight?.color !== this.moodlight?.color)
            || (moodlight?.alpha !== this.moodlight?.alpha);

        this.moodlight = moodlight;

        if(shouldRerender) {
            const backgroundItems = this.roomRenderer.getFilteredItems((item) => item.type === "wall" || item.type === "floor");

            for(const item of backgroundItems) {
                if(item instanceof RoomWallItem || item instanceof RoomFloorItem) {
                    item.render();
                }
            }
        }
        
        if(this.moodlight?.enabled && !this.moodlight.backgroundOnly) {
            this.lightSprite.blendMode = "multiply";
            this.lightSprite.alpha = 1;
            this.lightSprite.tint = this.moodlight.color;

            this.lightSprite.visible = true;
        }
        else {
            this.lightSprite.visible = false;
        }
    }

    public render(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        if(!this.moodlight?.enabled) {
            return;
        }

        this.drawLight(context);
    }

    public drawLight(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        if(!this.moodlight) {
            return;
        }

        context.save();
        
        context.globalCompositeOperation = "multiply";
        context.fillStyle = this.moodlight.color;
        
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        
        context.restore();
    }
}