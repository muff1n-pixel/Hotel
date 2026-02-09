export type NavigatorRoomsEventData = {
    title: string;
    rooms: {
        id: string;
        name: string;
        users: number;
        maxUsers: number;
    }[];
}[];
