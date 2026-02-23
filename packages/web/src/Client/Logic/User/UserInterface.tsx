export interface UserInterface {
    id: string;
    name: string;
    email: string;
    credits: number,
    diamonds: number,
    duckets: number,
    avatar: string;
    motto: string;

    preferences: {
        allowFriendsRequest: boolean;
        allowFriendsFollow: boolean;
    };
}