export default interface ProtobuffListener<User, T> {
    minimumDurationBetweenEvents?: number;

    handle(user: User, payload: T): Promise<void>;
}
