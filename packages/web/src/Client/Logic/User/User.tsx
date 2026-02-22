import { UserInterface } from "./UserInterface";

export default class User implements UserInterface {
    declare id: string;
    declare name: string;
    declare credits: number;
    declare diamonds: number;
    declare duckets: number;
    declare avatar: string;
    declare motto: string;

    constructor(data: UserInterface) {
        this.id = data.id;
        this.name = data.name;
        this.credits = data.credits;
        this.diamonds = data.diamonds;
        this.duckets = data.duckets;
        this.avatar = data.avatar;
        this.motto = data.motto;
    }
}