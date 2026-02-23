import { UserInterface } from "./UserInterface";

export default class User implements UserInterface {
    declare id: string;
    declare name: string;
    declare email: string;
    declare credits: number;
    declare diamonds: number;
    declare duckets: number;
    declare avatar: string;
    declare motto: string;

    declare preferences: {
        allowFriendsRequest: boolean;
        allowFriendsFollow: boolean;
    };

    constructor(data: UserInterface) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.credits = data.credits;
        this.diamonds = data.diamonds;
        this.duckets = data.duckets;
        this.avatar = data.avatar;
        this.motto = data.motto;

        this.preferences = {
            allowFriendsFollow: data.preferences.allowFriendsFollow,
            allowFriendsRequest: data.preferences.allowFriendsRequest,
        };
    }
}