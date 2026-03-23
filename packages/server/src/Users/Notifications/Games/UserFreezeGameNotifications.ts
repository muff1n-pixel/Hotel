import { WidgetNotificationData } from "@pixel63/events";
import { RoomFreezeGamePlayer, RoomFreezeGamePowerups, RoomFreezeGameTeam } from "../../../Rooms/Games/Freeze/RoomFreezeGame";
import { randomUUID } from "crypto";

export default class UserFreezeGameNotifications {
    public static buildPlayerJoinedTeam(team: RoomFreezeGameTeam) {
        return WidgetNotificationData.create({
            id: randomUUID(),
            text: `You have joined the ${team} team!`,
            imageUrl: `/assets/widgets/freeze/team_${team}.png`
        });
    }

    public static buildGameEnded(reason: "counter" | "eliminations", winnerTeam: RoomFreezeGameTeam | null, winnerScore: number | undefined) {
        if(reason === "counter") {
            return WidgetNotificationData.create({
                id: randomUUID(),
                text: `The game of Freeze has ran out of time, ${(winnerTeam)?(`the ${winnerTeam} team won the game with ${winnerScore} score`):("no team managed to snatch the victory")}!`,
                imageUrl: `/assets/widgets/freeze/team_${(winnerTeam)?(winnerTeam):("red")}.png`
            });
        }
        else {
            return WidgetNotificationData.create({
                id: randomUUID(),
                text: `${(winnerTeam)?(`The ${winnerTeam} team won the game of Freeze with ${winnerScore} score`):("No team managed to snatch the victory")}!`,
                imageUrl: `/assets/widgets/freeze/team_${(winnerTeam)?(winnerTeam):("red")}.png`
            });
        }
    }

    public static buildPlayerHit(player: RoomFreezeGamePlayer, triggerPlayer: RoomFreezeGamePlayer) {
        return WidgetNotificationData.create({
            id: randomUUID(),
            text: `You got hit by ${(player.roomUser.user.model.id === triggerPlayer.roomUser.user.model.id)?("your own"):(triggerPlayer.roomUser.user.model.name + "'s")} snowball!`,
            imageUrl: `/assets/widgets/freeze/team_${triggerPlayer.team}_frozen.png`
        });
    }

    public static buildTriggerPlayerHit(triggerPlayer: RoomFreezeGamePlayer) {
        return WidgetNotificationData.create({
            id: randomUUID(),
            text: `You hit ${triggerPlayer.roomUser.user.model.name} with a snowball, good job!`,
            imageUrl: `/assets/widgets/freeze/team_${triggerPlayer.team}_frozen.png`
        });
    }
    
    public static buildPlayerEliminated() {
        return WidgetNotificationData.create({
            id: randomUUID(),
            text: `You lost all your lives and were eliminated from the round!`,
            imageUrl: "/assets/widgets/freeze/exit.png"
        });
    }

    public static buildPickedUpPowerUp(powerup: RoomFreezeGamePowerups) {
        switch(powerup) {
            case RoomFreezeGamePowerups.ExtraLife: {
                return WidgetNotificationData.create({
                    id: randomUUID(),
                    text: `You picked up an Extra Life power-up!`,
                    imageUrl: `/assets/widgets/freeze/extra_life.png`
                });
            }

            case RoomFreezeGamePowerups.BiggerBomb: {
                return WidgetNotificationData.create({
                    id: randomUUID(),
                    text: `You picked up a Bigger Bomb power-up! Your snowballs now reach 1 tile further!`,
                    imageUrl: `/assets/widgets/freeze/bigger_bomb.png`
                });
            }

            case RoomFreezeGamePowerups.Shield: {
                return WidgetNotificationData.create({
                    id: randomUUID(),
                    text: `You picked up a Shield power-up! You are invincible for 5 seconds!`,
                    imageUrl: `/assets/widgets/freeze/shield.png`
                });
            }

            case RoomFreezeGamePowerups.CrossBlast: {
                return WidgetNotificationData.create({
                    id: randomUUID(),
                    text: `You picked up a X-Blast power-up! Your next snowball will cross diagonally!`,
                    imageUrl: `/assets/widgets/freeze/crossblast.png`
                });
            }

            case RoomFreezeGamePowerups.MorePower: {
                return WidgetNotificationData.create({
                    id: randomUUID(),
                    text: `You picked up a More Power power-up! You can now throw more snowballs simultaneously!`,
                    imageUrl: `/assets/widgets/freeze/more_bombs.png`
                });
            }

            case RoomFreezeGamePowerups.MegaSnowball: {
                return WidgetNotificationData.create({
                    id: randomUUID(),
                    text: `You picked up a Mega Snowball power-up! Your next snowball will affect a larger area of tiles!`,
                    imageUrl: `/assets/widgets/freeze/mega_bomb.png`
                });
            }
        }
    }
}