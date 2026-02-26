export interface UserInterface {
    id: string;
    name: string;
    email: string;
    lastLogin: Date | null;
    credits: number,
    diamonds: number,
    duckets: number,
    avatar: string;
    motto: string;
    figureConfiguration: string;

    preferences: {
        allowFriendsRequest: boolean;
        allowFriendsFollow: boolean;
    };
}