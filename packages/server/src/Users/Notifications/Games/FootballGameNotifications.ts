import { WidgetNotificationData } from "@pixel63/events";
import { randomUUID } from "crypto";
import { RoomBattleBanzaiGameTeam } from "../../../Rooms/Games/BattleBanzai/Interfaces/RoomBattleBanzaiGameTeam";
import { RoomFootballGamePlayer } from "../../../Rooms/Games/Football/Interfaces/RoomFootballGamePlayer";
import { RoomFootballGameTeam } from "../../../Rooms/Games/Football/Interfaces/RoomFootballGameTeam";

export default class FootballGameNotifications {
    public static buildPlayerJoinedGame(player: RoomFootballGamePlayer) {
        return WidgetNotificationData.create({
            id: randomUUID(),
            text: `${player.roomUser.user.model.name} joined the football game!`,
            figureConfiguration: player.roomUser.getFigureConfiguration()
        });
    }

    public static buildGameStarted() {
        return WidgetNotificationData.create({
            id: randomUUID(),
            text: `The game of Football has started! Score as many goals on your opponent as you can before the timer runs out.`,
            imageUrl: `/assets/widgets/football/black.png`
        });
    }

    public static buildTeamScored(player: RoomFootballGamePlayer, team: RoomFootballGameTeam) {
        return WidgetNotificationData.create({
            id: randomUUID(),
            text: `${player.roomUser.user.model.name} scored for the ${team} team!`,
            imageUrl: `/assets/widgets/football/${team}.png`
        });
    }

    public static buildGameEnded(reason: "counter" | "eliminations", winnerTeam: RoomBattleBanzaiGameTeam | null, winnerScore: number | undefined) {
        return WidgetNotificationData.create({
            id: randomUUID(),
            text: `The game of Football has ran out of time, ${(winnerTeam)?(`the ${winnerTeam} team won the game with ${winnerScore} goals`):("no team managed to snatch the victory")}!`,
            imageUrl: `/assets/widgets/football/${winnerTeam ?? "black"}.png`
        });
    }
}
