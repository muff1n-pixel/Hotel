import { webSocketClient } from "@Game/index";
import { GetHotelActivityRewardsData } from "@pixel63/events";
import { HotelActivityRewardData, HotelActivityRewardsData } from "@pixel63/events/build/Hotel/ActivityRewards/HotelActivityRewardsData";
import { useEffect, useState } from "react";

export function useHotelActivityRewards() {
    const [value, setValue] = useState<HotelActivityRewardData[]>();

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(HotelActivityRewardsData, {
            async handle(payload: HotelActivityRewardsData) {
                setValue(payload.activityRewards);
            },
        })

        webSocketClient.sendProtobuff(GetHotelActivityRewardsData, GetHotelActivityRewardsData.create({}));

        return () => {
            webSocketClient.removeProtobuffListener(HotelActivityRewardsData, listener);
        };
    }, []);

    return value;
}
