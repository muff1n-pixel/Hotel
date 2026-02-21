import { UserInterface } from "./UserInterface";

export default class User implements UserInterface {
    id: string;
    username: string;
    avatar: string;
    motto: string;

    constructor(data: UserInterface) {
        this.id = data.id;
        this.username = data.username;
        this.avatar = data.avatar;
        this.motto = data.motto;
    }
}