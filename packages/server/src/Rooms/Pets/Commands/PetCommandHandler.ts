import { CommandAliases } from "../../../Commands/CommandHandler";
import RoomUser from "../../Users/RoomUser";
import RoomPet from "../RoomPet";
import PetFreeCommand from "./Handlers/PetFreeCommand";
import PetSitCommand from "./Handlers/PetSitCommand";
import PetCommand from "./PetCommand";

export default class PetCommandHandler {
    private readonly commands: CommandAliases<typeof PetCommand>[] = [
        { command: PetSitCommand, aliases: [ "sit" ] },
        { command: PetFreeCommand, aliases: [ "free" ] },
    ];

    public async handleCommand(roomUser: RoomUser, roomPet: RoomPet, alias: string, parameters: string): Promise<boolean> {
        const commandAlias = this.commands.find((commandAlias) => commandAlias.aliases.includes(alias.toLowerCase()));

        if(!commandAlias) {
            return false;
        }

        const permissions = await roomUser.user.getPermissions();

        const command = new commandAlias.command(roomUser.room, roomPet, parameters);

        if(!command.validate(roomUser, permissions)) {
            return false;
        }

        await command.handle(roomUser).catch(() => {
            return false;
        });

        return true;
    }
}
