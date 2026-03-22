import { GetUserProfileData, UserProfileData } from "@pixel63/events";
import { useEffect, useState } from "react";
import { webSocketClient } from "src";

export default function useUserProfile(userId: string) {
    const [profile, setProfile] = useState<UserProfileData>();

    useEffect(() => {
        const listener = webSocketClient.addProtobuffListener(UserProfileData, {
            async handle(payload: UserProfileData) {
                if(payload.id === userId) {
                    setProfile(payload);
                }
            },
        });

        webSocketClient.sendProtobuff(GetUserProfileData, GetUserProfileData.create({
            userId
        }));

        return () => {
            webSocketClient.removeProtobuffListener(UserProfileData, listener);
        };
    }, [userId]);

    return profile;
}
