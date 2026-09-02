import { CommandAliases } from "../../../Commands/CommandHandler";
import RoomUser from "../../Users/RoomUser";
import RoomPet from "../RoomPet";
import PetBegCommand from "./Handlers/PetBegCommand";
import PetDownCommand from "./Handlers/PetDownCommand";
import PetDrinkCommand from "./Handlers/PetDrinkCommand";
import PetEatCommand from "./Handlers/PetEatCommand";
import PetFreeCommand from "./Handlers/PetFreeCommand";
import PetHereCommand from "./Handlers/PetHereCommand";
import PetPlayDeadCommand from "./Handlers/PetPlayDeadCommand";
import PetPlayFootballCommand from "./Handlers/PetPlayFootballCommand";
import PetSitCommand from "./Handlers/PetSitCommand";
import PetStandCommand from "./Handlers/PetStandCommand";
import PetCommand from "./PetCommand";

export default class PetCommandHandler {
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
