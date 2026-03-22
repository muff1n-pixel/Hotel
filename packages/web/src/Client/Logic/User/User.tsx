import { UserInterface } from "./UserInterface";

export default class User implements UserInterface {
    declare id: string;
    declare name: string;
    declare email: string | null;
    declare lastLogin: Date | null;
    declare credits: number;
    declare diamonds: number;
    declare duckets: number;
    declare motto: string;
    declare online: boolean;
    declare figureConfiguration: object;
    declare friends: Array<UserInterface>;

    declare preferences: {
        allowFriendsRequest: boolean;
        allowFriendsFollow: boolean;
        allowTrade: boolean;
    };

    constructor(data: UserInterface) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email || null;
        this.lastLogin = data.lastLogin || null;
        this.credits = data.credits || 0;
        this.diamonds = data.diamonds || 0;
        this.duckets = data.duckets || 0;
        this.motto = data.motto || "";
        this.online = data.online || false;
        this.figureConfiguration = data.figureConfiguration;
        this.friends = data.friends || [];

        this.preferences = {
            allowFriendsFollow: data.preferences ? data.preferences.allowFriendsFollow : false,
            allowFriendsRequest: data.preferences ? data.preferences.allowFriendsRequest : false,
            allowTrade: data.preferences ? data.preferences.allowTrade : false
        };
    }
}