import RoomFloorItem from "@Client/Room/Items/Map/RoomFloorItem";
import RoomWallItem from "@Client/Room/Items/Map/RoomWallItem";
import RoomRenderer from "@Client/Room/Renderer/RoomRenderer";
import { UserFurnitureMoodlightData, UserFurnitureTonerData } from "@pixel63/events";
import { Sprite, Texture } from "pixi.js";

export default class RoomLighting {
    private readonly MAX_DARKNESS = 0.75;

    public moodlight?: UserFurnitureMoodlightData;
    public previewMoodlight?: UserFurnitureMoodlightData;

    public backgroundToner?: UserFurnitureTonerData;
    public previewToner?: UserFurnitureTonerData;

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
        }
        else {
            this.backgroundToner = undefined;
        }

        this.updateBackgroundToner();
    }

    public updateBackgroundToner() {
        const toner = this.previewToner ?? this.backgroundToner;

        if(toner?.enabled) {
            this.backgroundSprite.tint = toner.color;
        }
        else {
            this.backgroundSprite.tint = 0x00;
        }
    }

    public setMoodlightData(moodlight?: UserFurnitureMoodlightData) {
        const shouldRerender = 
            (moodlight?.enabled !== this.moodlight?.enabled && this.moodlight?.backgroundOnly)
            || (moodlight?.backgroundOnly !== this.moodlight?.backgroundOnly)
            || (moodlight?.color !== this.moodlight?.color);

        this.moodlight = moodlight;

        this.updateMoodlightData(shouldRerender);
    }

    public updateMoodlightData(shouldRerender: boolean = true) {
        if(shouldRerender) {
            const backgroundItems = this.roomRenderer.entityManager.entities.filter((item) => item.type === "wall" || item.type === "floor");

            for(const item of backgroundItems) {
                if(item instanceof RoomWallItem || item instanceof RoomFloorItem) {
                    item.renderSpritesWithLighting();
                }
            }
        }

        const moodlight = this.previewMoodlight ?? this.moodlight;
        
        if(moodlight?.enabled && !moodlight.backgroundOnly) {
            this.lightSprite.blendMode = "multiply";
            this.lightSprite.alpha = 1;
            this.lightSprite.tint = moodlight.color;

            this.lightSprite.visible = true;
        }
        else {
            this.lightSprite.visible = false;
        }
    }

    public setPreviewMoodlightData(moodlight?: UserFurnitureMoodlightData) {
        this.previewMoodlight = moodlight;

        this.updateMoodlightData();
    }

    public setPreviewTonerData(toner?: UserFurnitureTonerData) {
        this.previewToner = toner;

        this.updateBackgroundToner();
    }

    public shouldRenderBackground() {
        const moodlight = this.previewMoodlight ?? this.moodlight;

        return moodlight?.enabled && moodlight?.backgroundOnly;
    }

    public render(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        if(!this.moodlight?.enabled) {
            return;
        }

        this.drawLight(context);
    }

    public drawLight(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        const moodlight = this.previewMoodlight ?? this.moodlight;

        if(!moodlight) {
            return;
        }

        context.save();
        
        context.globalCompositeOperation = "multiply";
        context.fillStyle = moodlight.color;
        
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        
        context.restore();
    }
}