import RoomFloorItem from "@Client/Room/Items/Map/RoomFloorItem";
import RoomWallItem from "@Client/Room/Items/Map/RoomWallItem";
import RoomRenderer from "@Client/Room/Renderer";
import { UserFurnitureTonerData } from "@pixel63/events";
import { RoomMoodlightData } from "@Shared/Interfaces/Room/RoomMoodlightData";

export default class RoomLighting {
    private readonly MAX_DARKNESS = 0.75;

    public moodlight?: RoomMoodlightData;
    public backgroundToner?: UserFurnitureTonerData;

    constructor(private roomRenderer: RoomRenderer) {

    }

    public setBackgroundTonerData(backgroundToner: UserFurnitureTonerData) {
        if(backgroundToner.enabled) {
            this.backgroundToner = backgroundToner;
        }
        else {
            this.backgroundToner = undefined;
        }
    }

    public setMoodlightData(moodlight?: RoomMoodlightData) {
        const shouldRerender = 
            (moodlight?.enabled !== this.moodlight?.enabled && this.moodlight?.backgroundOnly)
            || (moodlight?.backgroundOnly !== this.moodlight?.backgroundOnly)
            || (moodlight?.color !== this.moodlight?.color)
            || (moodlight?.alpha !== this.moodlight?.alpha);

        this.moodlight = moodlight;

        if(shouldRerender) {
            const backgroundItems = this.roomRenderer.items.filter((item) => item.type === "wall" || item.type === "floor");

            for(const item of backgroundItems) {
                if(item instanceof RoomWallItem || item instanceof RoomFloorItem) {
                    item.render();
                }
            }
        }
    }

    public render(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        if(!this.moodlight?.enabled) {
            return;
        }

        this.drawDarkness(context);
        this.drawLight(context);
    }

    public drawDarkness(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        if(!this.moodlight) {
            return;
        }

        context.save();

        const raw = this.moodlight.alpha;

        const darkness = (1 - raw / 255) * this.MAX_DARKNESS;

        context.globalCompositeOperation = "multiply";
        context.globalAlpha = darkness;
        context.fillStyle = "#000000";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        context.restore();
    }

    public drawLight(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
        if(!this.moodlight) {
            return;
        }

        context.save();
        
        context.globalCompositeOperation = "soft-light";
        context.globalAlpha = 0.6;
        context.fillStyle = this.moodlight.color;
        
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        
        context.restore();
    }
}