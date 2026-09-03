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

export default class PetCommandHandler {
    // Shorthand commands, such as "play" must be listed after "play football" as otherwise "play football" will be matched for "play"
    private readonly commands: CommandAliases<typeof PetCommand>[] = [
        { command: PetSitCommand, aliases: [ "sit" ] },
        { command: PetFreeCommand, aliases: [ "free" ] },
        { command: PetDownCommand, aliases: [ "lay", "down" ] },
        { command: PetStandCommand, aliases: [ "stand", "up" ] },
        { command: PetHereCommand, aliases: [ "here", "come here" ] },
        { command: PetDrinkCommand, aliases: [ "drink" ] },
        { command: PetEatCommand, aliases: [ "eat" ] },
        { command: PetBegCommand, aliases: [ "beg" ] },
        { command: PetPlayFootballCommand, aliases: [ "play football", "play soccer", "play ball" ] },
        { command: PetPlayDeadCommand, aliases: [ "play dead" ] },
        { command: PetPlayCommand, aliases: [ "play" ] },
        { command: PetStayCommand, aliases: [ "stay" ] },
        { command: PetFollowLeftCommand, aliases: [ "follow left" ] },
        { command: PetFollowRightCommand, aliases: [ "follow right" ] },
        { command: PetFollowCommand, aliases: [ "follow" ] },
        { command: PetJumpCommand, aliases: [ "jump" ] },
        { command: PetMoveForwardCommand, aliases: [ "move forward" ] },
        { command: PetMoveLeftCommand, aliases: [ "move left" ] },
        { command: PetMoveRightCommand, aliases: [ "move right" ] },
        { command: PetTurnLeftCommand, aliases: [ "turn left" ] },
        { command: PetTurnRightCommand, aliases: [ "turn right" ] },
        { command: PetNestCommand, aliases: [ "nest" ] },
    ];

    public async handleCommand(roomUser: RoomUser, roomPet: RoomPet, alias: string): Promise<boolean> {
        const commandAlias = this.commands.find((commandAlias) => commandAlias.aliases.some((commandAlias) => commandAlias.startsWith(alias.toLowerCase())));

        if(!commandAlias) {
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
