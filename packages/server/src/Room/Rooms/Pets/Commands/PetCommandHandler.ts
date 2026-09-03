import { CommandAliases } from "../../../Commands/CommandHandler";
import RoomUser from "../../Users/RoomUser";
import RoomPet from "../RoomPet";
import PetBegCommand from "./Handlers/PetBegCommand";
import PetDownCommand from "./Handlers/PetDownCommand";
import PetDrinkCommand from "./Handlers/PetDrinkCommand";
import PetEatCommand from "./Handlers/PetEatCommand";
import PetFollowCommand from "./Handlers/PetFollowCommand";
import PetFollowLeftCommand from "./Handlers/PetFollowLeftCommand";
import PetFollowRightCommand from "./Handlers/PetFollowRightCommand";
import PetFreeCommand from "./Handlers/PetFreeCommand";
import PetHereCommand from "./Handlers/PetHereCommand";
import PetJumpCommand from "./Handlers/PetJumpCommand";
import PetMoveForwardCommand from "./Handlers/PetMoveForwardCommand";
import PetMoveLeftCommand from "./Handlers/PetMoveLeftCommand";
import PetMoveRightCommand from "./Handlers/PetMoveRightCommand";
import PetNestCommand from "./Handlers/PetNestCommand";
import PetPlayCommand from "./Handlers/PetPlayCommand";
import PetPlayDeadCommand from "./Handlers/PetPlayDeadCommand";
import PetPlayFootballCommand from "./Handlers/PetPlayFootballCommand";
import PetSitCommand from "./Handlers/PetSitCommand";
import PetStandCommand from "./Handlers/PetStandCommand";
import PetStayCommand from "./Handlers/PetStayCommand";
import PetTurnLeftCommand from "./Handlers/PetTurnLeftCommand";
import PetTurnRightCommand from "./Handlers/PetTurnRightCommand";
import PetCommand from "./PetCommand";

export type PetCommandAliases = (CommandAliases<typeof PetCommand> & {
    minimumLevel?: number;
});

export default class PetCommandHandler {
    // Shorthand commands, such as "play" must be listed after "play football" as otherwise "play football" will be matched for "play"
    private readonly commands: PetCommandAliases[] = [
        { minimumLevel: 1, command: PetSitCommand, aliases: [ "sit" ] },
        { minimumLevel: 1, command: PetNestCommand, aliases: [ "nest" ] },
        { minimumLevel: 1, command: PetEatCommand, aliases: [ "eat" ] },
        { minimumLevel: 1, command: PetDrinkCommand, aliases: [ "drink" ] },

        { minimumLevel: 2, command: PetFreeCommand, aliases: [ "free" ] },
        { minimumLevel: 2, command: PetStayCommand, aliases: [ "stay" ] },
        { minimumLevel: 2, command: PetStandCommand, aliases: [ "stand", "up" ] },

        { minimumLevel: 3, command: PetBegCommand, aliases: [ "beg" ] },
        { minimumLevel: 3, command: PetJumpCommand, aliases: [ "jump" ] },
        { minimumLevel: 3, command: PetDownCommand, aliases: [ "lay", "down" ] },

        { minimumLevel: 5, command: PetPlayFootballCommand, aliases: [ "play football", "play soccer", "play ball" ] },
        { minimumLevel: 5, command: PetPlayDeadCommand, aliases: [ "play dead" ] },
        { minimumLevel: 5, command: PetPlayCommand, aliases: [ "play" ] },

        { minimumLevel: 10, command: PetMoveForwardCommand, aliases: [ "move forward" ] },
        { minimumLevel: 10, command: PetMoveLeftCommand, aliases: [ "move left" ] },
        { minimumLevel: 10, command: PetMoveRightCommand, aliases: [ "move right" ] },

        { minimumLevel: 15, command: PetHereCommand, aliases: [ "here", "come here" ] },
        { minimumLevel: 15, command: PetTurnLeftCommand, aliases: [ "turn left" ] },
        { minimumLevel: 15, command: PetTurnRightCommand, aliases: [ "turn right" ] },

        { minimumLevel: 20, command: PetFollowLeftCommand, aliases: [ "follow left" ] },
        { minimumLevel: 20, command: PetFollowRightCommand, aliases: [ "follow right" ] },
        { minimumLevel: 20, command: PetFollowCommand, aliases: [ "follow" ] },
    ];

    public async handleCommand(roomUser: RoomUser, roomPet: RoomPet, alias: string): Promise<boolean> {
        const commandAlias = this.commands.find((commandAlias) => commandAlias.aliases.some((commandAlias) => commandAlias.startsWith(alias.toLowerCase())));

        if(!commandAlias) {
            return false;
        }

        if(commandAlias.minimumLevel !== undefined && roomPet.model.level < commandAlias.minimumLevel) {
            return false;
        }

        const command = new commandAlias.command(roomUser.room, roomPet);

        if(!command.validate(roomUser, roomUser.user.permissions)) {
            return false;
        }

        await command.handle(roomUser).catch(() => {
            return false;
        });

        return true;
    }
}
