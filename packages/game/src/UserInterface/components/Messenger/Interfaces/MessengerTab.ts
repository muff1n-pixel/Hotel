import { UserFriendData } from "@pixel63/events";
import { MessengerEntry } from "src/UserInterface/Components/Messenger/Interfaces/MessengerEntry";

export type MessengerTab = {
    friend: UserFriendData;

    entries: MessengerEntry[];
};
