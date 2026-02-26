export type RoomChatOptionsData = {
    italic?: boolean;
    transparent?: boolean;
    hideUsername?: boolean;
};

export type RoomChatEventData = {
    message: string;
    options?: RoomChatOptionsData;
    roomChatStyleId: string;
} & ({
    type: "user";
    userId: string;
} | {
    type: "bot";
    botId: string;
});
