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
    allow_friends_request: boolean;
    allow_friends_follow: boolean;
}