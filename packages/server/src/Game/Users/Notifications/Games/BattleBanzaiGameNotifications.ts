import { WidgetNotificationData } from "@pixel63/events";
import { randomUUID } from "crypto";
import { RoomBattleBanzaiGameTeam } from "../../../Rooms/Games/BattleBanzai/Interfaces/RoomBattleBanzaiGameTeam";

export default class BattleBanzaiGameNotifications {
    public static buildPlayerJoinedTeam(team: RoomBattleBanzaiGameTeam) {
        return WidgetNotificationData.create({
            id: randomUUID(),
            text: `You have joined the ${team} team!`,
            imageUrl: `/assets/widgets/battlebanzai/joined.png`
        });
    }

    public static buildGameStarted() {
        return WidgetNotificationData.create({
            id: randomUUID(),
            text: `The game of Battle Banzai has started! Lock as many tiles as you can before the timer runs out.`,
            imageUrl: `/assets/widgets/battlebanzai/battleball.png`
        });
    }

    public static buildGameEnded(reason: "counter" | "eliminations", winnerTeam: RoomBattleBanzaiGameTeam | null, winnerScore: number | undefined) {
        if(reason === "counter") {
            return WidgetNotificationData.create({
                id: randomUUID(),
                text: `The game of Battle Banzai has ran out of time, ${(winnerTeam)?(`the ${winnerTeam} team won the game with ${winnerScore} score`):("no team managed to snatch the victory")}!`,
                imageUrl: `/assets/widgets/battlebanzai/counter.png`
            });
        }
        else {
            return WidgetNotificationData.create({
                id: randomUUID(),
                text: `${(winnerTeam)?(`The ${winnerTeam} team won the game of Battle Banzai with ${winnerScore} score`):("No team managed to snatch the victory")}!`,
                imageUrl: `/assets/widgets/battlebanzai/battleball.png`
            });
        }
    }
}
