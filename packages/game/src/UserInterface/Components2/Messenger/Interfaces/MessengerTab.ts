import { UserFriendData } from "@pixel63/events";
import { MessengerEntry } from "@UserInterface/Components2/Messenger/Interfaces/MessengerEntry";

export type MessengerTab = {
    friend: UserFriendData;

    entries: MessengerEntry[];
};
