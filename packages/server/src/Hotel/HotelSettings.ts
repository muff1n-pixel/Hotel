import { HotelSettingModel } from "../Database/Models/Hotel/HotelSettingModel";

export default class HotelSettings {
    public roomUserIdlingTimeout: number = 180;
    public roomUserTradeCompletionSeconds: number = 5;

    constructor() {

    }

    public async loadModels() {
        const settings = await HotelSettingModel.findAll();

        this.roomUserIdlingTimeout = this.findSetting(settings, "room.user.idling_timeout") ?? this.roomUserIdlingTimeout;
        this.roomUserTradeCompletionSeconds = this.findSetting(settings, "room.user.trade.completion_duration") ?? this.roomUserTradeCompletionSeconds;
    }

    private findSetting(settings: HotelSettingModel[], id: string) {
        return settings.find((setting) => setting.id === id)?.value;
    }
}
