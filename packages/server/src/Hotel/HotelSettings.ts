import { HotelSettingModel } from "../Database/Models/Hotel/HotelSettingModel";

export default class HotelSettings {
    public roomUserIdlingTimeout: number = 180;
    public roomUserTradeCompletionSeconds: number = 5;
    public roomMaxFloorFurniture: number = 4000;
    public roomMaxWallFurniture: number = 4000;

    constructor() {

    }

    public async loadModels() {
        const settings = await HotelSettingModel.findAll();

        this.roomUserIdlingTimeout = this.findSetting(settings, "room.user.idling_timeout") ?? this.roomUserIdlingTimeout;
        this.roomUserTradeCompletionSeconds = this.findSetting(settings, "room.user.trade.completion_duration") ?? this.roomUserTradeCompletionSeconds;
        
        this.roomMaxFloorFurniture = this.findSetting(settings, "room.max_floor_furniture") ?? this.roomMaxFloorFurniture;
        this.roomMaxWallFurniture = this.findSetting(settings, "room.max_wall_furniture") ?? this.roomMaxWallFurniture;

        return settings;
    }

    private findSetting(settings: HotelSettingModel[], id: string) {
        return settings.find((setting) => setting.id === id)?.value;
    }
}
