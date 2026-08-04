import { GetHotelSettingsData, HotelSettingsData, UpdateHotelSettingData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener";
import User from "../../../../Users/User";
import { HotelSettingModel } from "../../../../Database/Models/Hotel/HotelSettingModel";
import { game } from "../../../..";

export default class UpdateHotelSettingEvent implements ProtobuffListener<UpdateHotelSettingData> {
    async handle(user: User, payload: UpdateHotelSettingData) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("settings:edit")) {
            throw new Error("User is not privileged to edit settings.");
        }

        await HotelSettingModel.upsert({
            id: payload.id,
            value: payload.value
        });

        const settings = await game.hotelSettings.loadModels();

        user.sendProtobuff(HotelSettingsData, HotelSettingsData.create({
            settings: settings.map((setting) => {
                return {
                    id: setting.id,
                    value: setting.value
                };
            })
        }));
    }
}
