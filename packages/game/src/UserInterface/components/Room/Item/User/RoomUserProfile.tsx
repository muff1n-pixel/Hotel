import { RoomUserData } from "@Shared/Interfaces/Room/RoomUserData";
import FigureImage from "../../../Figure/FigureImage";
import { useUserBadges } from "../../../../hooks/userUserBadges";
import BadgeImage from "../../../Badges/BadgeImage";

export type RoomUserProfileProps = {
    user: RoomUserData;
}

export default function RoomUserProfile({ user }: RoomUserProfileProps) {
    const badges = useUserBadges(user.id);

    return (
        <div style={{
            background: "rgba(61, 61, 61, .95)",
            padding: 10,
            borderRadius: 6,
            fontSize: 11,

            minWidth: 170,

            display: "flex",
            flexDirection: "column",
            gap: 10
        }}>

            <b>{user.name}</b>

            <div style={{
                width: "100%",
                height: 1,
                background: "#333333"
            }}/>

            <div style={{
                display: "flex",
                gap: 6
            }}>
                <div style={{
                    background: "rgba(255, 255, 255, .1)",
                    border: "1px solid #000",
                    borderRadius: 6,

                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",

                    width: 67,
                    height: 130
                }}>
                    <FigureImage figureConfiguration={user.figureConfiguration} direction={2}/>
                </div>

                <div style={{
                    width: 40 + 40 + 4,

                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignContent: "flex-start",
                    gap: 4
                }}>
                    {badges.toReversed().map((userBadge) => (
                        <div style={{
                            width: 40,
                            height: 40
                        }}>
                            <BadgeImage badge={userBadge.badge}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
