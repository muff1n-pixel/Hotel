export interface UserInterface {
    id: string;
    accessToken: string;
    name: string;
    mail: string;
    credits: number,
    diamonds: number,
    duckets: number,
    avatar: string;
    motto: string;
    allowFriendsRequest: boolean;
    allowFriendsFollow: boolean;
}