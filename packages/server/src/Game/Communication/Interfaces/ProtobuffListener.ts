import User from "../../Users/User";

export default interface ProtobuffListener<T> {
    minimumDurationBetweenEvents?: number;

    handle(user: User, payload: T): Promise<void>;
}
