import { UserModel } from "../Database/Models/Users/UserModel";
import Room from "../Rooms/Room";
import RoomUser from "../Rooms/Users/RoomUser";
import UserPermissions from "../Users/Permissions/UserPermissions";
import { InvalidCommandParameterError } from "./Exceptions/InvalidCommandParameterError";
import { MissingCommandParameterError } from "./Exceptions/MissingCommandParameterError";

export default class Command {
    private readonly arguments: string[];
    private index = 0;

    constructor(private readonly room: Room, input: string) {
        this.arguments = input.trim().split(/\s+/);
    }

    public async handle(roomUser: RoomUser): Promise<void> {

    }

    public validate(roomUser: RoomUser, permissions: UserPermissions) {
        return true;
    };

    async parseUser(name: string): Promise<UserModel> {
        const value = this.parseString(name);

        const user = await UserModel.findOne({
            where: {
                name: value
            }
        });

        if(!user) {
            throw new InvalidCommandParameterError(`"${value}" is not an existing user.`);
        }

        return user;
    }

    parseRoomUser(name: string): RoomUser {
        const value = this.parseString(name);

        const roomUser = this.room.users.find((roomUser) => roomUser.user.model.name.toLowerCase() === value.toLowerCase());

        if(!roomUser) {
            throw new InvalidCommandParameterError(`"${value}" is not a room user.`);
        }

        return roomUser;
    }

    parseString(name: string): string {
        const value = this.arguments[this.index++];

        if (!value) {
            throw new MissingCommandParameterError(`Missing parameter: ${name}`);
        }

        return value;
    }

    parseRemainingString(name: string, required: boolean): string {
        const value = this.arguments.slice(this.index).join(" ");

        if (!value && required) {
            throw new MissingCommandParameterError(`Missing parameter: ${name}`);
        }

        this.index = this.arguments.length;

        return value;
    }

    parseNumber(name: string): number {
        const value = this.parseString(name);
        const number = Number(value);

        if (Number.isNaN(number)) {
            throw new InvalidCommandParameterError(`"${value}" is not a valid number.`);
        }

        return number;
    }

    parseFloat(name: string): number {
        const value = this.parseString(name);
        const number = Number.parseFloat(value);

        if (Number.isNaN(number)) {
            throw new InvalidCommandParameterError(`"${value}" is not a valid number.`);
        }

        return number;
    }

    parseBoolean(name: string): boolean {
        const value = this.parseString(name).toLowerCase();

        switch (value) {
            case "1":
            case "true":
                return true;

            case "0":
            case "false":
                return false;

            default:
                throw new InvalidCommandParameterError(
                    `"${value}" is not a valid boolean. Expected true, false, 1, or 0.`
                );
        }
    }

    parseEnum<T extends string>(name: string, values: readonly T[]): T {
        const value = this.parseString(name);

        if (!values.includes(value as T)) {
            throw new InvalidCommandParameterError(
                `${name} must be one of: ${values.join(", ")}`
            );
        }

        return value as T;
    }

    hasNextArgument(): boolean {
        return this.index < this.arguments.length;
    }
}
