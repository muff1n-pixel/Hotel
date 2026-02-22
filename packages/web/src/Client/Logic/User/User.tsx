import { UserInterface } from "./UserInterface";

export default class User implements UserInterface {
    declare id: string;
    declare accessToken: string;
    declare name: string;
    declare mail: string;
    declare credits: number;
    declare diamonds: number;
    declare duckets: number;
    declare avatar: string;
    declare motto: string;
    declare allow_friends_request: boolean;
    declare allow_friends_follow: boolean;

    constructor(data: UserInterface) {
        this.id = data.id;
        this.accessToken = data.accessToken;
        this.name = data.name;
        this.mail = data.mail;
        this.credits = data.credits;
        this.diamonds = data.diamonds;
        this.duckets = data.duckets;
        this.avatar = data.avatar;
        this.motto = data.motto;
        this.allow_friends_follow = data.allow_friends_request;
        this.allow_friends_follow = data.allow_friends_follow;
    }
}