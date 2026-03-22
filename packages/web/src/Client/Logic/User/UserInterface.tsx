export interface UserInterface {
    id: string;
    name: string;
    email: string | null;
    lastLogin: Date | null;
    credits: number;
    diamonds: number;
    duckets: number;
    motto: string;
    online: boolean;
    figureConfiguration: object;
    friends: Array<UserInterface>;

    preferences: {
        allowFriendsRequest: boolean;
        allowFriendsFollow: boolean;
        allowTrade: boolean;
    };
}