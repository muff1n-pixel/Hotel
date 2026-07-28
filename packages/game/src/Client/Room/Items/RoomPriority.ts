import { RoomPositionData } from "@pixel63/events";

export default class RoomPriority {
    public static readonly FLOOR_SPRITE_PRIORITY = -8000;
    public static readonly WALL_SPRITE_PRIORITY = this.FLOOR_SPRITE_PRIORITY - 1;
    public static readonly FLOOR_SHADOW_SPRITE_PRIORITY = this.WALL_SPRITE_PRIORITY - 1;

    public static readonly DOOR_POSITION_SPRITE_PRIORITY = this.FLOOR_SPRITE_PRIORITY + 1;
    
    public static readonly WALL_MASK_SPRITE_PRIORITY = this.WALL_SPRITE_PRIORITY;

    public static readonly WALL_DOOR_SPRITE_PRIORITY = -7100;
    public static readonly FLOOR_ELEVATED_SPRITE_PRIORITY = -50;

    public static readonly WALL_FURNITURE_SPRITE_PRIORITY = -5000;

    public static getDoorPositionPriority(position: RoomPositionData) {
        return this.DOOR_POSITION_SPRITE_PRIORITY + (position.depth * 10);
    }
}
