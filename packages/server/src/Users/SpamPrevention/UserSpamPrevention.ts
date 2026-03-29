import { MessageType } from "@pixel63/events";
import User from "../User";

export default class UserSpamProtection {
    private eventMap: Map<string, number> = new Map();

    constructor(private readonly user: User) {

    }

    public registerEventTimestamp(type: string) {
        this.eventMap.set(type, performance.now());
    }

    public getDurationSinceLastEvent(type: string) {
        const timestamp = this.eventMap.get(type);

        if(timestamp === undefined) {
            return Infinity;
        }

        return performance.now() - timestamp;
    }
}
