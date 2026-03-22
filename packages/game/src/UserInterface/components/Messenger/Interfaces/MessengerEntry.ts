export type MessengerMessageEntry = {
    id: number;
    type: "message";

    userId: string;
    message: string[];

    receivedAt: Date;
};

export type MessengerStatusEntry = {
    id: number;
    type: "status";

    status: string;

    receivedAt: Date;
};

export type MessengerEntry = MessengerMessageEntry | MessengerStatusEntry;
