import { UserInterface } from "./UserInterface";

export default class User implements UserInterface {
    declare id: string;
    declare name: string;
    declare email: string;
    declare lastLogin: Date | null;
    declare credits: number;
    declare diamonds: number;
    declare duckets: number;
    declare avatar: string;
    declare motto: string;
    declare figureConfiguration: string;

    declare preferences: {
        allowFriendsRequest: boolean;
        allowFriendsFollow: boolean;
    };

    constructor(data: UserInterface) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.lastLogin = data.lastLogin;
        this.credits = data.credits;
        this.diamonds = data.diamonds;
        this.duckets = data.duckets;
        this.avatar = data.avatar;
        this.motto = data.motto;
        this.figureConfiguration = data.figureConfiguration;

        this.preferences = {
            allowFriendsFollow: data.preferences.allowFriendsFollow,
            allowFriendsRequest: data.preferences.allowFriendsRequest,
        };
    }
}