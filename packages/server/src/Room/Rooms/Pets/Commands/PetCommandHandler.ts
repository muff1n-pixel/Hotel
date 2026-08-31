import { CommandAliases } from "../../../Commands/CommandHandler";
import RoomUser from "../../Users/RoomUser";
import RoomPet from "../RoomPet";
import PetDownCommand from "./Handlers/PetDownCommand";
import PetDrinkCommand from "./Handlers/PetDrinkCommand";
import PetFreeCommand from "./Handlers/PetFreeCommand";
import PetHereCommand from "./Handlers/PetHereCommand";
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
    ];

    public async handleCommand(roomUser: RoomUser, roomPet: RoomPet, alias: string, parameters: string): Promise<boolean> {
        const commandAlias = this.commands.find((commandAlias) => commandAlias.aliases.includes(alias.toLowerCase()));

        if(!commandAlias) {
            return false;
        }

        const command = new commandAlias.command(roomUser.room, roomPet, parameters);

        if(!command.validate(roomUser, roomUser.user.permissions)) {
            return false;
        }

        await command.handle(roomUser).catch(() => {
            return false;
        });

        return true;
    }
}
