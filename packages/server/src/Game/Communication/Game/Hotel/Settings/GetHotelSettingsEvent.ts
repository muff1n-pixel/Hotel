import { GetHotelSettingsData, HotelSettingsData } from "@pixel63/events";
import ProtobuffListener from "../../../Interfaces/ProtobuffListener";
import User from "../../../../Users/User";
import { HotelSettingModel } from "../../../../Database/Models/Hotel/HotelSettingModel";

export default class GetHotelSettingsEvent implements ProtobuffListener<GetHotelSettingsData> {
    async handle(user: User) {
        const permissions = await user.getPermissions();

        if(!permissions.hasPermission("settings:edit")) {
            throw new Error("User is not privileged to edit settings.");
        }

        const settings = await HotelSettingModel.findAll();

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
