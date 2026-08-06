import RoomUser from "../../Room/Rooms/Users/RoomUser.js";
import SitCommand from "./Handlers/SitCommand.js";
import WaveCommand from "./Handlers/WaveCommand.js";
import EnableCommand from "./Handlers/EnableCommand.js";
import SpeedCommand from "./Handlers/SpeedCommand.js";
import CarryCommand from "./Handlers/CarryCommand.js";
import TeleportCommand from "./Handlers/TeleportCommand.js";
import GiveCommand from "./Handlers/GiveCommand.js";
import DanceCommand from "./Handlers/DanceCommand.js";
import AwayFromKeyboardCommand from "./Handlers/AwayFromKeyboardCommand.js";
import SignCommand from "./Handlers/SignCommand.js";
import StandCommand from "./Handlers/StandCommand.js";
import LaughCommand from "./Handlers/LaughCommand.js";
import Command from "./Command.js";
import { RoomActorChatData } from "@pixel63/events";
import { MissingCommandParameterError } from "./Exceptions/MissingCommandParameterError.js";
import { InvalidCommandParameterError } from "./Exceptions/InvalidCommandParameterError.js";
import KickCommand from "./Handlers/KickCommand.js";
import SoftKickCommand from "./Handlers/SoftKickCommand.js";

export type CommandAliases<T = typeof Command> = {
    command: T;
    aliases: string[];
};

export default class CommandHandler {
    private readonly commands: CommandAliases[] = [
        { command: StandCommand, aliases: [ "stand" ]},
        { command: SitCommand, aliases: [ "sit" ]},
        { command: WaveCommand, aliases: [ "wave" ] },
        { command: LaughCommand, aliases: [ "laugh" ] },
        { command: EnableCommand, aliases: [ "enable" ] },
        { command: DanceCommand, aliases: [ "dance" ] },
        { command: SignCommand, aliases: [ "sign" ] },
        { command: CarryCommand, aliases: [ "carry" ] },
        { command: SpeedCommand, aliases: [ "speed" ] },
        { command: AwayFromKeyboardCommand, aliases: [ "afk", "brb" ] },
        { command: TeleportCommand, aliases: [ "teleport", "tp" ] },
        { command: GiveCommand, aliases: [ "give" ] },
        { command: KickCommand, aliases: [ "kick" ]},
        { command: SoftKickCommand, aliases: [ "softkick" ]}
    ];

    public async handleCommand(roomUser: RoomUser, alias: string, parameters: string, focusedUserId: string | undefined): Promise<boolean> {
        const commandAlias = this.commands.find((commandAlias) => commandAlias.aliases.includes(alias.toLowerCase()));

        if(!commandAlias) {
            return false;
        }

        const command = new commandAlias.command(roomUser.room, parameters, focusedUserId);

        if(!command.validate(roomUser, roomUser.user.permissions)) {
            return false;
        }

        await command.handle(roomUser).catch((error) => {
            console.error(error);

            if(error instanceof MissingCommandParameterError) {
                roomUser.user.sendProtobuff(RoomActorChatData, RoomActorChatData.create({
                    actor: {
                        user: {
                            userId: roomUser.user.model.id
                        }
                    },

                    message: error.message,
                    roomChatStyleId: "notification",
                    options: {
                        italic: true,
                        hideUsername: true
                    }
                }));
            }
            else if(error instanceof InvalidCommandParameterError) {
                roomUser.user.sendProtobuff(RoomActorChatData, RoomActorChatData.create({
                    actor: {
                        user: {
                            userId: roomUser.user.model.id
                        }
                    },

                    message: error.message,
                    roomChatStyleId: "notification",
                    options: {
                        italic: true,
                        hideUsername: true
                    }
                }));
            }
        });

        return true;
    }
}
